import { ValidatorFn, AbstractControl } from '@angular/forms';

export function enumValidator(enumArr: any[]): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    if(!control.value && control.value !== 0) {
      return null;
    }
    let found = false;
    enumArr.forEach(element => {
      // tslint:disable-next-line
      if(element == control.value) {
        found = true;
        return;
      }
    });
    return !found ? {'enumValidator': {value: control.value}} : null;
  };
}

export function minNumberValidator(testValue: number): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    console.log(control);
    if(!control.value) {
      return null;
    }
    console.log(control.value, testValue);
    return (control.value > testValue) ? {'minNumber': {value: control.value}} : null;
  };
}
