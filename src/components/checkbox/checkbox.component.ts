import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'merlot-checkbox',
  template: '<input type="checkbox" [(ngModel)]="iModel" (ngModelChange)="updateModel($event)" />',
  encapsulation: ViewEncapsulation.Native
})
export class CheckboxComponent implements OnInit {
  @Input('iModel') iModel: any;
  @Input('schema') schema: any;
  @Output() ngModelChange = new EventEmitter();
  public ui: any;

  constructor() { }

  ngOnInit() {
    this.ui = this.schema.ui || {};
  }

  updateModel($event: any) {
    this.ngModelChange.emit($event);
  }
}
