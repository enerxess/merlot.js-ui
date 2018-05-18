import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'merlot-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss']
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

  updateModel($event) {
    this.ngModelChange.emit($event);
  }
}
