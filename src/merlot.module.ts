import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MerlotComponent } from './merlot.component';
import { Merlot } from './merlot.service';
import { FormsModule } from '@angular/forms';
import { InputComponent } from './components/input/input.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { RadioComponent } from './components/radio/radio.component';

@NgModule({
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
})
export class MerlotModule { }
