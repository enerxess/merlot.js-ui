import { Inject, Injectable, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, ReplaySubject } from 'rxjs';

import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';

import { enumValidator, minNumberValidator } from './validators';

@Injectable()
export class Merlot {
  schemes: ReplaySubject<any> = new ReplaySubject<any>(1);
  data$: Observable<any> = this.schemes.asObservable();

  public components: any[] = [];
  public defaultComponents: any = {};

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    @Inject('MERLOT_CONFIG') private MERLOT_CONFIG: any
  ) {
    this.http.get(`${this.MERLOT_CONFIG.apiUrl}discover`).subscribe(schemesArr => {
      this.schemes.next(schemesArr);
    });
  }

  getSchemaByName(name: string): Observable<any> {
    return new Observable(observer => {
      this.schemes.subscribe(schemes => {
        if(schemes[name]) {
          observer.next(schemes[name]);
          observer.complete();
        } else {
          observer.error({err: `Schema ${name} unknown.`});
        }
      });
    });
  }

  /* tslint:disable:no-unused-expression */
  getValidatorsBySchemaEntry(schemaEntry: any): any[] {
    const validatorsArr = [];
    schemaEntry.required ? validatorsArr.push(Validators.required) : '';
    schemaEntry.enum ? validatorsArr.push(enumValidator(schemaEntry.enum)) : '';
    if(schemaEntry.type === 'Number') {
      (schemaEntry.min || schemaEntry.min === 0) ? validatorsArr.push(Validators.min(schemaEntry.min)) : '';
      (schemaEntry.max || schemaEntry.max === 0) ? validatorsArr.push(Validators.max(schemaEntry.max)) : '';
    } else if(schemaEntry.type === 'String') {
      schemaEntry.min ? validatorsArr.push(Validators.minLength(schemaEntry.min)) : '';
      schemaEntry.max ? validatorsArr.push(Validators.maxLength(schemaEntry.max)) : '';
      schemaEntry.pattern ? validatorsArr.push(Validators.pattern(schemaEntry.pattern)) : '';
    }
    return validatorsArr;
  }

  getDefaultValue(schema: any) {
    if(schema.default) {
      return schema.default;
    } else {
      switch(schema.type) {
        case 'Boolean': return false;
        default: return '';
      }
    }
  }

  /**
   * Create a ReactiveForms FormGroup that maps to the given schema.
   */
  rParseSchema(form: any, schema: any): FormGroup {
    Object.keys(schema).forEach(key => {
      const schemaEntry = schema[key];
      // Ignore Virtuals
      if(!schemaEntry.virtual) {
        if(schemaEntry.type) {
          form.addControl(key, new FormControl(this.getDefaultValue(schemaEntry), this.getValidatorsBySchemaEntry(schemaEntry)));
        } else {
          // Handle if FormArray of FormGroup
          if(schemaEntry instanceof Array) {
            // Check if array has childs
            if(schemaEntry[0].type) {
              // No Childs expected
              form.addControl(key, this.fb.array([]));
            } else {
              // Childs expected
              form.addControl(key, this.fb.array([this.rParseSchema(this.fb.group({}), schemaEntry[0])]));
            }
          } else if(schemaEntry instanceof Object) {
            form.addControl(key, this.rParseSchema(this.fb.group({}), schemaEntry));
          }
        }
      }
    });
    return form;
  }

  createFormBySchema(name: string): Observable<FormGroup> {
    return new Observable(observer => {
      let mForm = this.fb.group({});
      this.getSchemaByName(name).subscribe(schema => {
        mForm = this.rParseSchema(mForm, schema);
        observer.next(mForm);
        observer.complete();
      });
    });
  }

  rPopulateForm(form: FormGroup, data: any): void {
    Object.keys(<any>form.controls).forEach(controlKey => {
      if(!data[controlKey]) {
        return;
      }
      const control = form.get(controlKey);
      if(!control) {
        return;
      }
      if(Array.isArray(control.value)) {
        data[controlKey].forEach((value: any) => {
          if(Array.isArray(value)) {
            (<any>control).push(new FormArray([]));
            this.rPopulateForm(<any>control, data[controlKey]);
          } else if(typeof value === 'object') {
            (<any>control).push(new FormGroup({}));
            this.rPopulateForm(<any>control, data[controlKey]);
          } else {
            (<any>control).push(new FormControl());
          }
        });
      } else if(typeof control.value === 'object') {
        this.rPopulateForm(<FormGroup>control, data[controlKey]);
      }
    });
  }

  populateForm(form: FormGroup, data: any): void {
    this.rPopulateForm(form, data);
    form.patchValue(data);
  }

  registerComponent(name: string, component: any): void {
    this.components.push({name, component});
  }

  getComponentByName(name: string): any {
    let component;
    if(!this.components.length) {
      return undefined;
    }
    this.components.forEach(componentObj => {
      if(componentObj.name === name) {
        component = componentObj.component;
      }
    });
    return component;
  }

  useComponentSet(componentSet: any): void {
    componentSet.templates.forEach((componentObj: any) => {
      this.registerComponent(componentObj.name, componentObj.component);
    });
    this.defaultComponents = componentSet.defaultTemplates;
  }

  getDefaultComponentByType(type: any): any {
    return this.defaultComponents[type];
  }

}
