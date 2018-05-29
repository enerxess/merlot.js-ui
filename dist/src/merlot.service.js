import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { enumValidator } from './validators';
var Merlot = /** @class */ (function () {
    function Merlot(http, fb, MERLOT_CONFIG) {
        var _this = this;
        this.http = http;
        this.fb = fb;
        this.MERLOT_CONFIG = MERLOT_CONFIG;
        this.schemes = new ReplaySubject(1);
        this.data$ = this.schemes.asObservable();
        this.components = [];
        this.defaultComponents = {};
        this.http.get(this.MERLOT_CONFIG.apiUrl + "discover").subscribe(function (schemesArr) {
            _this.schemes.next(schemesArr);
        });
    }
    Merlot.prototype.getSchemaByName = function (name) {
        var _this = this;
        return new Observable(function (observer) {
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
        schemaEntry.required ? validatorsArr.push(Validators.required) : '';
        schemaEntry.enum ? validatorsArr.push(enumValidator(schemaEntry.enum)) : '';
        if (schemaEntry.type === 'Number') {
            (schemaEntry.min || schemaEntry.min === 0) ? validatorsArr.push(Validators.min(schemaEntry.min)) : '';
            (schemaEntry.max || schemaEntry.max === 0) ? validatorsArr.push(Validators.max(schemaEntry.max)) : '';
        }
        else if (schemaEntry.type === 'String') {
            schemaEntry.min ? validatorsArr.push(Validators.minLength(schemaEntry.min)) : '';
            schemaEntry.max ? validatorsArr.push(Validators.maxLength(schemaEntry.max)) : '';
            schemaEntry.pattern ? validatorsArr.push(Validators.pattern(schemaEntry.pattern)) : '';
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
                    form.addControl(key, new FormControl(_this.getDefaultValue(schemaEntry), _this.getValidatorsBySchemaEntry(schemaEntry)));
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
        return new Observable(function (observer) {
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
                        control.push(new FormArray([]));
                        _this.rPopulateForm(control, data[controlKey]);
                    }
                    else if (typeof value === 'object') {
                        control.push(new FormGroup({}));
                        _this.rPopulateForm(control, data[controlKey]);
                    }
                    else {
                        control.push(new FormControl());
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
        { type: Injectable },
    ];
    /** @nocollapse */
    Merlot.ctorParameters = function () { return [
        { type: HttpClient, },
        { type: FormBuilder, },
        { type: undefined, decorators: [{ type: Inject, args: ['MERLOT_CONFIG',] },] },
    ]; };
    return Merlot;
}());
export { Merlot };
//# sourceMappingURL=merlot.service.js.map