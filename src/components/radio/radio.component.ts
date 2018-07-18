import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'merlot-radio',
  template: '<input type="radio" [(ngModel)]="iModel" (ngModelChange)="updateModel($event)" />',
  encapsulation: ViewEncapsulation.Native
})
export class RadioComponent implements OnInit {
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
