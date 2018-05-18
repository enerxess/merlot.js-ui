import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
export declare class Merlot {
    private http;
    private fb;
    private MERLOT_CONFIG;
    schemes: ReplaySubject<any>;
    data$: Observable<any>;
    components: any[];
    defaultComponents: any;
    constructor(http: HttpClient, fb: FormBuilder, MERLOT_CONFIG: any);
    getSchemaByName(name: string): Observable<any>;
    getValidatorsBySchemaEntry(schemaEntry: any): any[];
    getDefaultValue(schema: any): any;
    /**
     * Create a ReactiveForms FormGroup that maps to the given schema.
     */
    rParseSchema(form: any, schema: any): FormGroup;
    createFormBySchema(name: string): Observable<FormGroup>;
    registerComponent(name: string, component: any): void;
    getComponentByName(name: string): any;
    useComponentSet(componentSet: any): void;
    getDefaultComponentByType(type: any): any;
}
