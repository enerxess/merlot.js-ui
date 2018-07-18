(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common/http'), require('rxjs'), require('@angular/forms'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/common/http', 'rxjs', '@angular/forms', '@angular/common'], factory) :
    (factory((global.merlot = global.merlot || {}, global.merlot.js = global.merlot.js || {}, global.merlot.js.ui = {}),global.ng.core,null,null,null,null));
}(this, (function (exports,core,http,rxjs,forms,common) { 'use strict';

    function enumValidator(enumArr) {
        return function (control) {
            if (!control.value && control.value !== 0) {
                return null;
            }
            var found = false;
            enumArr.forEach(function (element) {
                // tslint:disable-next-line
                if (element == control.value) {
                    found = true;
                    return;
                }
            });
            return !found ? { 'enumValidator': { value: control.value } } : null;
        };
    }

    var Merlot = /** @class */ (function () {
        function Merlot(http$$1, fb, MERLOT_CONFIG) {
            var _this = this;
            this.http = http$$1;
            this.fb = fb;
            this.MERLOT_CONFIG = MERLOT_CONFIG;
            this.schemes = new rxjs.ReplaySubject(1);
            this.data$ = this.schemes.asObservable();
            this.components = [];
            this.defaultComponents = {};
            this.http.get(this.MERLOT_CONFIG.apiUrl + "discover").subscribe(function (schemesArr) {
                _this.schemes.next(schemesArr);
            });
        }
        Merlot.prototype.getSchemaByName = function (name) {
            var _this = this;
            return new rxjs.Observable(function (observer) {
                _this.schemes.subscribe(function (schemes) {
                    if (schemes[name]) {
                        observer.next(schemes[name]);
                        observer.complete();
                    }
                    else {
                        observer.error({ err: "Schema " + name + " unknown." });
                    }
                });
            });
        };
        /* tslint:disable:no-unused-expression */
        /* tslint:disable:no-unused-expression */
        Merlot.prototype.getValidatorsBySchemaEntry = /* tslint:disable:no-unused-expression */
        function (schemaEntry) {
            var validatorsArr = [];
            schemaEntry.required ? validatorsArr.push(forms.Validators.required) : '';
            schemaEntry.enum ? validatorsArr.push(enumValidator(schemaEntry.enum)) : '';
            if (schemaEntry.type === 'Number') {
                (schemaEntry.min || schemaEntry.min === 0) ? validatorsArr.push(forms.Validators.min(schemaEntry.min)) : '';
                (schemaEntry.max || schemaEntry.max === 0) ? validatorsArr.push(forms.Validators.max(schemaEntry.max)) : '';
            }
            else if (schemaEntry.type === 'String') {
                schemaEntry.min ? validatorsArr.push(forms.Validators.minLength(schemaEntry.min)) : '';
                schemaEntry.max ? validatorsArr.push(forms.Validators.maxLength(schemaEntry.max)) : '';
                schemaEntry.pattern ? validatorsArr.push(forms.Validators.pattern(schemaEntry.pattern)) : '';
            }
            return validatorsArr;
        };
        Merlot.prototype.getDefaultValue = function (schema) {
            if (schema.default) {
                return schema.default;
            }
            else {
                switch (schema.type) {
                    case 'Boolean': return false;
                    default: return '';
                }
            }
        };
        /**
         * Create a ReactiveForms FormGroup that maps to the given schema.
         */
        /**
           * Create a ReactiveForms FormGroup that maps to the given schema.
           */
        Merlot.prototype.rParseSchema = /**
           * Create a ReactiveForms FormGroup that maps to the given schema.
           */
        function (form, schema) {
            var _this = this;
            Object.keys(schema).forEach(function (key) {
                var schemaEntry = schema[key];
                // Ignore Virtuals
                if (!schemaEntry.virtual) {
                    if (schemaEntry.type) {
                        form.addControl(key, new forms.FormControl(_this.getDefaultValue(schemaEntry), _this.getValidatorsBySchemaEntry(schemaEntry)));
                    }
                    else {
                        // Handle if FormArray of FormGroup
                        if (schemaEntry instanceof Array) {
                            // Check if array has childs
                            if (schemaEntry[0].type) {
                                // No Childs expected
                                form.addControl(key, _this.fb.array([]));
                            }
                            else {
                                // Childs expected
                                form.addControl(key, _this.fb.array([_this.rParseSchema(_this.fb.group({}), schemaEntry)]));
                            }
                        }
                        else if (schemaEntry instanceof Object) {
                            form.addControl(key, _this.rParseSchema(_this.fb.group({}), schemaEntry));
                        }
                    }
                }
            });
            return form;
        };
        Merlot.prototype.createFormBySchema = function (name) {
            var _this = this;
            return new rxjs.Observable(function (observer) {
                var mForm = _this.fb.group({});
                _this.getSchemaByName(name).subscribe(function (schema) {
                    mForm = _this.rParseSchema(mForm, schema);
                    observer.next(mForm);
                    observer.complete();
                });
            });
        };
        Merlot.prototype.rPopulateForm = function (form, data) {
            var _this = this;
            Object.keys(form.controls).forEach(function (controlKey) {
                if (!data[controlKey]) {
                    return;
                }
                var control = form.get(controlKey);
                if (!control) {
                    return;
                }
                if (Array.isArray(control.value)) {
                    data[controlKey].forEach(function (value) {
                        if (Array.isArray(value)) {
                            control.push(new forms.FormArray([]));
                            _this.rPopulateForm(control, data[controlKey]);
                        }
                        else if (typeof value === 'object') {
                            control.push(new forms.FormGroup({}));
                            _this.rPopulateForm(control, data[controlKey]);
                        }
                        else {
                            control.push(new forms.FormControl());
                        }
                    });
                }
                else if (typeof control.value === 'object') {
                    _this.rPopulateForm(control, data[controlKey]);
                }
            });
        };
        Merlot.prototype.populateForm = function (form, data) {
            this.rPopulateForm(form, data);
            form.patchValue(data);
        };
        Merlot.prototype.registerComponent = function (name, component) {
            this.components.push({ name: name, component: component });
        };
        Merlot.prototype.getComponentByName = function (name) {
            var component;
            if (!this.components.length) {
                return undefined;
            }
            this.components.forEach(function (componentObj) {
                if (componentObj.name === name) {
                    component = componentObj.component;
                }
            });
            return component;
        };
        Merlot.prototype.useComponentSet = function (componentSet) {
            var _this = this;
            componentSet.templates.forEach(function (componentObj) {
                _this.registerComponent(componentObj.name, componentObj.component);
            });
            this.defaultComponents = componentSet.defaultTemplates;
        };
        Merlot.prototype.getDefaultComponentByType = function (type) {
            return this.defaultComponents[type];
        };
        Merlot.decorators = [
            { type: core.Injectable },
        ];
        /** @nocollapse */
        Merlot.ctorParameters = function () { return [
            { type: http.HttpClient, },
            { type: forms.FormBuilder, },
            { type: undefined, decorators: [{ type: core.Inject, args: ['MERLOT_CONFIG',] },] },
        ]; };
        return Merlot;
    }());

    var CheckboxComponent = /** @class */ (function () {
        function CheckboxComponent() {
            this.ngModelChange = new core.EventEmitter();
        }
        CheckboxComponent.prototype.ngOnInit = function () {
            this.ui = this.schema.ui || {};
        };
        CheckboxComponent.prototype.updateModel = function ($event) {
            this.ngModelChange.emit($event);
        };
        CheckboxComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'merlot-checkbox',
                        template: '<input type="checkbox" [(ngModel)]="iModel" (ngModelChange)="updateModel($event)" />',
                        encapsulation: core.ViewEncapsulation.Native
                    },] },
        ];
        /** @nocollapse */
        CheckboxComponent.ctorParameters = function () { return []; };
        CheckboxComponent.propDecorators = {
            "iModel": [{ type: core.Input, args: ['iModel',] },],
            "schema": [{ type: core.Input, args: ['schema',] },],
            "ngModelChange": [{ type: core.Output },],
        };
        return CheckboxComponent;
    }());

    var InputComponent = /** @class */ (function () {
        function InputComponent() {
            this.ngModelChange = new core.EventEmitter();
        }
        InputComponent.prototype.ngOnInit = function () {
            this.ui = this.schema.ui || {};
        };
        InputComponent.prototype.updateModel = function ($event) {
            this.ngModelChange.emit($event);
        };
        InputComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'merlot-input',
                        template: '<input type="text" [(ngModel)]="iModel" (ngModelChange)="updateModel($event)" />',
                        encapsulation: core.ViewEncapsulation.Native
                    },] },
        ];
        /** @nocollapse */
        InputComponent.ctorParameters = function () { return []; };
        InputComponent.propDecorators = {
            "iModel": [{ type: core.Input, args: ['iModel',] },],
            "schema": [{ type: core.Input, args: ['schema',] },],
            "ngModelChange": [{ type: core.Output },],
        };
        return InputComponent;
    }());

    var MERLOT_CVA = {
        provide: forms.NG_VALUE_ACCESSOR,
        useExisting: core.forwardRef(function () { return MerlotComponent; }),
        multi: true
    };
    var MERLOT_FORWARD_VALIDATORS = {
        provide: forms.NG_VALIDATORS,
        useExisting: core.forwardRef(function () { return MerlotComponent; }),
        multi: true,
    };
    var MerlotComponent = /** @class */ (function () {
        function MerlotComponent(merlot, factoryResolver, viewContainerRef) {
            this.merlot = merlot;
            this.factoryResolver = factoryResolver;
            this.viewContainerRef = viewContainerRef;
            this.defaultTemplates = { 'String': InputComponent, 'Number': InputComponent, 'Boolean': CheckboxComponent, 'Date': InputComponent };
            this.propagateChange = function (_) { };
        }
        MerlotComponent.prototype.ngOnInit = function () {
            var _this = this;
            var dynamicComponent;
            if (this.schema instanceof Array) {
                // Arrays within merlot-component can only be used, when they dont contain any other children.
                this.schema = this.schema[0];
                this.iModel = this.formArrayItems;
            }
            if ((this.schema.ui && this.schema.ui.template) || this.overrideTemplate) {
                (this.overrideTemplate) ?
                    dynamicComponent = this.merlot.getComponentByName(this.overrideTemplate)
                    : dynamicComponent = this.merlot.getComponentByName(this.schema.ui.template);
                if (dynamicComponent === undefined) {
                    console.error("Can't find an Component named " + (this.overrideTemplate || this.schema.ui.template) + ". Did you forget to register it to Merlot?");
                    return;
                }
            }
            else {
                dynamicComponent = this.merlot.getDefaultComponentByType(this.schema.type) || this.defaultTemplates[this.schema.type];
            }
            var factory = this.factoryResolver.resolveComponentFactory(dynamicComponent);
            this.component = factory.create(this.viewContainerRef.parentInjector);
            this.viewContainerRef.insert(this.component.hostView);
            this.component.instance.iModel = this.iModel;
            this.component.instance.schema = this.schema;
            this.component.instance.ngModelChange.subscribe(function (event) { _this.updateModel(event); });
        };
        MerlotComponent.prototype.writeValue = function (value) {
            this.iModel = value;
            this.component.instance.iModel = this.iModel;
        };
        MerlotComponent.prototype.registerOnChange = function (fn) {
            this.propagateChange = fn;
        };
        MerlotComponent.prototype.registerOnTouched = function (fn) {
        };
        MerlotComponent.prototype.validate = function (control) {
            this.component.instance.control = control;
            return null;
        };
        MerlotComponent.prototype.updateModel = function (data) {
            this.iModel = data;
            this.propagateChange(data);
        };
        MerlotComponent.decorators = [
            { type: core.Component, args: [{
                        // tslint:disable-next-line
                        selector: 'merlot',
                        template: '',
                        providers: [MERLOT_CVA, MERLOT_FORWARD_VALIDATORS]
                    },] },
        ];
        /** @nocollapse */
        MerlotComponent.ctorParameters = function () { return [
            { type: Merlot, },
            { type: core.ComponentFactoryResolver, },
            { type: core.ViewContainerRef, },
        ]; };
        MerlotComponent.propDecorators = {
            "formControlName": [{ type: core.Input, args: ['formControlName',] },],
            "formArrayItems": [{ type: core.Input, args: ['formArrayItems',] },],
            "schema": [{ type: core.Input, args: ['schema',] },],
            "overrideTemplate": [{ type: core.Input, args: ['overrideTemplate',] },],
        };
        return MerlotComponent;
    }());

    var RadioComponent = /** @class */ (function () {
        function RadioComponent() {
            this.ngModelChange = new core.EventEmitter();
        }
        RadioComponent.prototype.ngOnInit = function () {
            this.ui = this.schema.ui || {};
        };
        RadioComponent.prototype.updateModel = function ($event) {
            this.ngModelChange.emit($event);
        };
        RadioComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'merlot-radio',
                        template: '<input type="radio" [(ngModel)]="iModel" (ngModelChange)="updateModel($event)" />',
                        encapsulation: core.ViewEncapsulation.Native
                    },] },
        ];
        /** @nocollapse */
        RadioComponent.ctorParameters = function () { return []; };
        RadioComponent.propDecorators = {
            "iModel": [{ type: core.Input, args: ['iModel',] },],
            "schema": [{ type: core.Input, args: ['schema',] },],
            "ngModelChange": [{ type: core.Output },],
        };
        return RadioComponent;
    }());

    var MerlotModule = /** @class */ (function () {
        function MerlotModule() {
        }
        MerlotModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [
                            common.CommonModule,
                            forms.FormsModule
                        ],
                        exports: [
                            MerlotComponent
                        ],
                        declarations: [
                            MerlotComponent,
                            InputComponent,
                            CheckboxComponent,
                            RadioComponent
                        ],
                        /*providers: [
                            Merlot
                          ],*/
                        entryComponents: [
                            CheckboxComponent,
                            InputComponent,
                            RadioComponent,
                        ]
                    },] },
        ];
        return MerlotModule;
    }());

    exports.MerlotModule = MerlotModule;
    exports.Merlot = Merlot;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
