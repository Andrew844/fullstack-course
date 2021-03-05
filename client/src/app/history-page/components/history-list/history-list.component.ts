import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { OrderInterface } from '../../../shared/types/order.interface';
import { InitModalInterface } from '../../../shared/types/initModal.interface';
import { OrderPositionInterface } from '../../../shared/types/orderPosition.interface';
import { MaterialService } from '../../../shared/services/material.service';

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.scss'],
})
export class HistoryListComponent implements AfterViewInit, OnDestroy {
  @ViewChild('modal') modalRef: ElementRef;
  @Input('orders') ordersProps: OrderInterface[];

  modal: InitModalInterface;
  selectedOrder: OrderInterface;

  constructor() {}

  computePrice(order: OrderInterface): number {
    return order.list.reduce((total: number, item: OrderPositionInterface) => {
      total += item.cost * item.quantity;
      return total;
    }, 0);
  }

  selectOrder(order: OrderInterface): void {
    this.selectedOrder = order;
    this.modal.open();
  }

  onCloseModal(): void {
    this.modal.close();
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  ngOnDestroy(): void {
    this.modal.destroy();
  }
}
