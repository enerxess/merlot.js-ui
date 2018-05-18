import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MerlotComponent } from './merlot.component';
import { FormsModule } from '@angular/forms';
import { InputComponent } from './components/input/input.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { RadioComponent } from './components/radio/radio.component';
var MerlotModule = /** @class */ (function () {
    function MerlotModule() {
    }
    MerlotModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        CommonModule,
                        FormsModule
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
export { MerlotModule };
//# sourceMappingURL=merlot.module.js.map