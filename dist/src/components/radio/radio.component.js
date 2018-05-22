import { Component, Input, Output, EventEmitter } from '@angular/core';
var RadioComponent = /** @class */ (function () {
    function RadioComponent() {
        this.ngModelChange = new EventEmitter();
    }
    RadioComponent.prototype.ngOnInit = function () {
        this.ui = this.schema.ui || {};
    };
    RadioComponent.prototype.updateModel = function ($event) {
        this.ngModelChange.emit($event);
    };
    RadioComponent.decorators = [
        { type: Component, args: [{
                    selector: 'merlot-radio',
                    template: '<input type="radio" [(ngModel)]="iModel" (ngModelChange)="updateModel($event)" />'
                },] },
    ];
    /** @nocollapse */
    RadioComponent.ctorParameters = function () { return []; };
    RadioComponent.propDecorators = {
        "iModel": [{ type: Input, args: ['iModel',] },],
        "schema": [{ type: Input, args: ['schema',] },],
        "ngModelChange": [{ type: Output },],
    };
    return RadioComponent;
}());
export { RadioComponent };
//# sourceMappingURL=radio.component.js.map