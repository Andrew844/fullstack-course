import { ElementRef } from '@angular/core';

export interface MaterializeInterface {
  nativeElement: any;
  Modal: any;
  TapTarget: any;
  Datepicker: any;
  Tooltip: any;
  FloatingActionButton: any;
  toast: (arg0: { html: string }) => void;
  initModal: (ref: ElementRef) => void;
  updateTextFields: () => void;
  initTooltip: () => void;
}
