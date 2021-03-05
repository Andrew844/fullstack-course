import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MaterialService } from '../../../shared/services/material.service';
import { InitModalInterface } from '../../../shared/types/initModal.interface';
import { OrderService } from '../../services/order.service';
import { OrderPositionInterface } from '../../../shared/types/orderPosition.interface';
import { OrdersService } from '../../../shared/services/orders.service';
import { OrderInterface } from '../../../shared/types/order.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.scss'],
  providers: [OrderService],
})
export class OrderPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('modal') modalRef: ElementRef;
  modal: InitModalInterface;

  ordersServiceSubscription: Subscription;
  pending = false;
  isRoot: boolean;

  constructor(
    private router: Router,
    public orderService: OrderService,
    private ordersService: OrdersService
  ) {}

  ngOnInit(): void {
    this.initializeValues();
  }

  initializeValues(): void {
    this.isRoot = this.router.url === '/order';
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isRoot = this.router.url === '/order';
      }
    });
  }

  openModal(): void {
    this.modal.open();
  }

  closeModal(): void {
    this.modal.close();
  }

  onSubmit(): void {
    this.pending = true;
    this.modal.close();

    const order: OrderInterface = {
      list: this.orderService.list.map((item) => {
        delete item._id;
        return item;
      }),
    };

    this.ordersServiceSubscription = this.ordersService.create(order).subscribe(
      (newOrder: OrderInterface) => {
        MaterialService.toast(`Заказ №${newOrder.order} был сохранён.`);
        this.orderService.clear();
      },
      (err) => MaterialService.toast(err.error.message),
      () => {
        this.modal.close();
        this.pending = false;
      }
    );
  }

  removePosition(orderPosition: OrderPositionInterface): void {
    this.orderService.remove(orderPosition);
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  ngOnDestroy(): void {
    this.modal.destroy();
    if (this.ordersServiceSubscription) {
      this.ordersServiceSubscription.unsubscribe();
    }
  }
}
