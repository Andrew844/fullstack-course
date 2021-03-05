import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AnalyticsService } from '../shared/services/analytics.service';
import { Observable } from 'rxjs';
import { OverviewResponseInterface } from '../shared/types/overviewResponse.interface';
import { MaterialInstance } from '../shared/types/materialInstance';
import { MaterialService } from '../shared/services/material.service';

@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrls: ['./overview-page.component.scss'],
})
export class OverviewPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('tapTarget') tapTargetRef: ElementRef;

  tapTarget: MaterialInstance;
  data$: Observable<OverviewResponseInterface>;
  yesterday = new Date();

  constructor(private analyticsService: AnalyticsService) {}

  openInfo(): void {
    this.tapTarget.open();
  }

  initializeValues(): void {
    this.data$ = this.analyticsService.getOverview();
    this.yesterday.setDate(this.yesterday.getDate() - 1);
  }

  ngOnInit(): void {
    this.initializeValues();
  }

  ngAfterViewInit(): void {
    this.tapTarget = MaterialService.initTapTarget(this.tapTargetRef);
  }

  ngOnDestroy(): void {
    this.tapTarget.destroy();
  }
}
