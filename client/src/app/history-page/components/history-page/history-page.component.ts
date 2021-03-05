import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MaterialService } from '../../../shared/services/material.service';
import { InitTooltipInterface } from '../../../shared/types/initTooltip.interface';
import { OrdersService } from '../../../shared/services/orders.service';
import { Subscription } from 'rxjs';
import { OrderInterface } from '../../../shared/types/order.interface';
import { FilterInterface } from '../../../shared/types/Filter.interface';

const STEP = 2;

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.scss'],
})
export class HistoryPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('tooltip') tooltipRef: ElementRef;
  tooltip: InitTooltipInterface;

  ordersServiceFetchSubscription: Subscription;

  offset = 0;
  limit = STEP;
  isFilterVisible = false;
  orders: OrderInterface[] = [];
  loading = false;
  reloading = false;
  noMoreOrders = false;
  filter: FilterInterface = {};

  constructor(private ordersService: OrdersService) {}

  ngOnInit(): void {
    this.reloading = true;
    this.fetchData();
  }

  fetchData(): void {
    const params = Object.assign({}, this.filter, {
      offset: this.offset,
      limit: this.limit,
    });

    this.loading = true;

    this.ordersServiceFetchSubscription = this.ordersService
      .fetch(params)
      .subscribe(
        (orders: OrderInterface[]) => {
          this.noMoreOrders = orders.length < STEP;
          this.orders = this.orders.concat(orders);
        },
        (err) => MaterialService.toast(err.error.message),
        () => {
          this.loading = false;
          this.reloading = false;
        }
      );
  }

  isFiltered(): boolean {
    return Object.keys(this.filter).length !== 0;
  }

  loadMore(): void {
    this.offset += STEP;
    this.fetchData();
  }

  applyFilter(filter: FilterInterface): void {
    this.orders = [];
    this.offset = 0;
    this.reloading = true;
    this.filter = filter;
    this.fetchData();
  }

  ngAfterViewInit(): void {
    this.tooltip = MaterialService.initTooltip(this.tooltipRef);
  }

  ngOnDestroy(): void {
    this.tooltip.destroy();
    this.ordersServiceFetchSubscription.unsubscribe();
  }
}
