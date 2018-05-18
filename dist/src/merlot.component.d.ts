import { OnInit, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormArray, Validator, ValidationErrors } from '@angular/forms';
import { Merlot } from './merlot.service';
export declare const MERLOT_CVA: any;
export declare const MERLOT_FORWARD_VALIDATORS: any;
export declare class MerlotComponent implements OnInit, ControlValueAccessor, Validator {
    private merlot;
    private factoryResolver;
    private viewContainerRef;
    formControlName: any;
    formArrayItems: FormArray;
    schema: any;
    overrideTemplate: string;
    iModel: any;
    ui: any;
    private defaultTemplates;
    private component;
    constructor(merlot: Merlot, factoryResolver: ComponentFactoryResolver, viewContainerRef: ViewContainerRef);
    ngOnInit(): void;
    writeValue(value: any): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    propagateChange: (_: any) => void;
    validate(control: AbstractControl): ValidationErrors | null;
    registerOnValidatorChange?(fn: () => void): void;
    updateModel(data: any): void;
}
