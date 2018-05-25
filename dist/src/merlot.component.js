import { Component, forwardRef, Input, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, FormArray } from '@angular/forms';
import { Merlot } from './merlot.service';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { InputComponent } from './components/input/input.component';
export var MERLOT_CVA = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function () { return MerlotComponent; }),
    multi: true
};
export var MERLOT_FORWARD_VALIDATORS = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(function () { return MerlotComponent; }),
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
        { type: Component, args: [{
                    // tslint:disable-next-line
                    selector: 'merlot',
                    template: '',
                    providers: [MERLOT_CVA, MERLOT_FORWARD_VALIDATORS]
                },] },
    ];
    /** @nocollapse */
    MerlotComponent.ctorParameters = function () { return [
        { type: Merlot, },
        { type: ComponentFactoryResolver, },
        { type: ViewContainerRef, },
    ]; };
    MerlotComponent.propDecorators = {
        "formControlName": [{ type: Input, args: ['formControlName',] },],
        "formArrayItems": [{ type: Input, args: ['formArrayItems',] },],
        "schema": [{ type: Input, args: ['schema',] },],
        "overrideTemplate": [{ type: Input, args: ['overrideTemplate',] },],
    };
    return MerlotComponent;
}());
export { MerlotComponent };
//# sourceMappingURL=merlot.component.js.map