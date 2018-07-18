import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
var InputComponent = /** @class */ (function () {
    function InputComponent() {
        this.ngModelChange = new EventEmitter();
    }
    InputComponent.prototype.ngOnInit = function () {
        this.ui = this.schema.ui || {};
    };
    InputComponent.prototype.updateModel = function ($event) {
        this.ngModelChange.emit($event);
    };
    InputComponent.decorators = [
        { type: Component, args: [{
                    selector: 'merlot-input',
                    template: '<input type="text" [(ngModel)]="iModel" (ngModelChange)="updateModel($event)" />',
                    encapsulation: ViewEncapsulation.Native
                },] },
    ];
    /** @nocollapse */
    InputComponent.ctorParameters = function () { return []; };
    InputComponent.propDecorators = {
        "iModel": [{ type: Input, args: ['iModel',] },],
        "schema": [{ type: Input, args: ['schema',] },],
        "ngModelChange": [{ type: Output },],
    };
    return InputComponent;
}());
export { InputComponent };
//# sourceMappingURL=input.component.js.map