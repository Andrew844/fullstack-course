import { ElementRef, Injectable } from '@angular/core';
import { MaterializeInterface } from '../types/materialize.interface';
import { InitModalInterface } from '../types/initModal.interface';
import { InitTooltipInterface } from '../types/initTooltip.interface';
import { InitDatePickerInterface } from '../types/initDatePicker.interface';
import { MaterialInstance } from '../types/materialInstance';

declare var M: MaterializeInterface;

@Injectable({
  providedIn: 'root',
})
export class MaterialService {
  static toast(message: string): void {
    M.toast({ html: message });
  }

  static initializeFloatingBtn(ref: ElementRef): void {
    M.FloatingActionButton.init(ref.nativeElement);
  }

  static updateTextFields(): void {
    M.updateTextFields();
  }

  static initModal(ref: ElementRef): InitModalInterface {
    return M.Modal.init(ref.nativeElement);
  }

  static initTooltip(ref: ElementRef): InitTooltipInterface {
    return M.Tooltip.init(ref.nativeElement);
  }

  static initDatePicker(
    ref: ElementRef,
    onClose: () => void
  ): InitDatePickerInterface {
    return M.Datepicker.init(ref.nativeElement, {
      format: 'dd.mm.yyyy',
      showClearBtn: true,
      onClose,
    });
  }

  static initTapTarget(ref: ElementRef): MaterialInstance {
    return M.TapTarget.init(ref.nativeElement);
  }
}
