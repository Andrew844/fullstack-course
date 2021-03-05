import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { AnalyticsService } from '../shared/services/analytics.service';
import { AnalyticsResponseInterface } from '../shared/types/analyticsResponse.interface';
import { MaterialService } from '../shared/services/material.service';
import { Subscription } from 'rxjs';
import { AnalyticsChartInterface } from '../shared/types/analyticsChart.interface';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.scss'],
})
export class AnalyticsPageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('gain') gainRef: ElementRef;
  @ViewChild('order') orderRef: ElementRef;

  average: number;
  pending = true;
  analyticsSubscription: Subscription;

  constructor(private analyticsService: AnalyticsService) {}

  initializeListeners(): void {
    this.analyticsSubscription = this.analyticsService.getAnalytics().subscribe(
      (data: AnalyticsResponseInterface) => {
        const gainCfg: any = {
          label: 'Доход',
          color: 'rgb(255,99,132)',
          labels: data.chart.map((item: AnalyticsChartInterface) => item.label),
          data: data.chart.map((item: AnalyticsChartInterface) => item.gain),
        };

        const orderCfg: any = {
          label: 'Заказы',
          color: 'rgb(54,162,235)',
          labels: data.chart.map((item: AnalyticsChartInterface) => item.label),
          data: data.chart.map((item: AnalyticsChartInterface) => item.order),
        };

        const gainCtx = this.gainRef.nativeElement.getContext('2d');
        const orderCtx = this.orderRef.nativeElement.getContext('2d');
        gainCtx.canvas.height = '300px';
        orderCtx.canvas.height = '300px';

        new Chart(gainCtx, createChartCfg(gainCfg));
        new Chart(orderCtx, createChartCfg(orderCfg));

        this.average = data.average;
        this.pending = false;
      },
      (err) => MaterialService.toast(err.error.message)
    );
  }

  ngAfterViewInit(): void {
    this.initializeListeners();
  }

  ngOnDestroy(): void {
    if (this.analyticsSubscription) {
      this.analyticsSubscription.unsubscribe();
    }
  }
}

function createChartCfg({ labels, data, label, color }) {
  return {
    type: 'line',
    options: {
      responsive: true,
    },
    data: {
      labels,
      datasets: [
        { label, data, borderColor: color, steppedLine: false, fill: false },
      ],
    },
  };
}
