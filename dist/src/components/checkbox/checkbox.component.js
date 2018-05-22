import { Component, Input, Output, EventEmitter } from '@angular/core';
var CheckboxComponent = /** @class */ (function () {
    function CheckboxComponent() {
        this.ngModelChange = new EventEmitter();
    }
    CheckboxComponent.prototype.ngOnInit = function () {
        this.ui = this.schema.ui || {};
    };
    CheckboxComponent.prototype.updateModel = function ($event) {
        this.ngModelChange.emit($event);
    };
    CheckboxComponent.decorators = [
        { type: Component, args: [{
                    selector: 'merlot-checkbox',
                    template: '<input type="checkbox" [(ngModel)]="iModel" (ngModelChange)="updateModel($event)" />'
                },] },
    ];
    /** @nocollapse */
    CheckboxComponent.ctorParameters = function () { return []; };
    CheckboxComponent.propDecorators = {
        "iModel": [{ type: Input, args: ['iModel',] },],
        "schema": [{ type: Input, args: ['schema',] },],
        "ngModelChange": [{ type: Output },],
    };
    return CheckboxComponent;
}());
export { CheckboxComponent };
//# sourceMappingURL=checkbox.component.js.map