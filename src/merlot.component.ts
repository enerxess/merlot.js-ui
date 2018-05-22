import { Component,
         OnInit,
         ViewChild,
         forwardRef,
         Input,
         ComponentFactoryResolver,
         Injectable,
         Inject,
         ViewContainerRef, 
         ComponentFactory} from '@angular/core';
import { FormControl, AbstractControl, ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormArray, Validator, ValidationErrors } from '@angular/forms';
import { Merlot } from './merlot.service';

import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { InputComponent } from './components/input/input.component';
import { RadioComponent } from './components/radio/radio.component';

export const MERLOT_CVA: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MerlotComponent),
  multi: true
};
export const MERLOT_FORWARD_VALIDATORS: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => MerlotComponent),
  multi: true,
};
@Component({
  // tslint:disable-next-line
  selector: 'merlot',
  template: '',
  providers: [MERLOT_CVA, MERLOT_FORWARD_VALIDATORS]
})
export class MerlotComponent implements OnInit, ControlValueAccessor, Validator {
  @Input('formControlName') formControlName: any;
  @Input('formArrayItems') formArrayItems: FormArray;
  @Input('schema') schema: any;
  @Input('overrideTemplate') overrideTemplate: string;

  public iModel: any;
  public ui: any;

  private defaultTemplates: any = {'String': InputComponent, 'Number': InputComponent, 'Boolean': CheckboxComponent, 'Date': InputComponent};
  private component: any;

  constructor(
    private merlot: Merlot,
    private factoryResolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngOnInit() {
    let dynamicComponent: any;
    if(this.schema instanceof Array) {
      // Arrays within merlot-component can only be used, when they dont contain any other children.
      this.schema = this.schema[0];
      this.iModel = this.formArrayItems;
    }
    if((this.schema.ui && this.schema.ui.template) || this.overrideTemplate) {
      (this.overrideTemplate) ?
          dynamicComponent = this.merlot.getComponentByName(this.overrideTemplate)
        : dynamicComponent = this.merlot.getComponentByName(this.schema.ui.template);
      if(dynamicComponent === undefined) {
        console.error(`Can't find an Component named ${this.overrideTemplate || this.schema.ui.template}. Did you forget to register it to Merlot?`);
        return;
      }
    } else {
      dynamicComponent = this.merlot.getDefaultComponentByType(this.schema.type) || this.defaultTemplates[this.schema.type];
    }
    const factory = this.factoryResolver.resolveComponentFactory(dynamicComponent);
    this.component = factory.create(this.viewContainerRef.parentInjector);
    this.viewContainerRef.insert(this.component.hostView);
    (<any>this.component.instance).iModel = this.iModel;
    (<any>this.component.instance).schema = this.schema;
    (<any>this.component.instance).ngModelChange.subscribe((event: any) => { this.updateModel(event); });
  }

  writeValue(value: any): void {
    this.iModel = value;
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  propagateChange = (_: any) => { };

  validate(control: AbstractControl): ValidationErrors | null {
    this.component.instance.control = control;
    return null;
  }

  registerOnValidatorChange?(fn: () => void): void;

  updateModel(data: any) {
    this.iModel = data;
    this.propagateChange(data);
  }

}
