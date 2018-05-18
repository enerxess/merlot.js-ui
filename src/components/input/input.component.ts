import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'merlot-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {
  @Input('iModel') iModel: any;
  @Input('schema') schema: any;
  @Output() ngModelChange = new EventEmitter();
  public ui: any;

  constructor() { }

  ngOnInit() {
    this.ui = this.schema.ui || {};
  }

  updateModel($event) {
    this.ngModelChange.emit($event);
  }
}
