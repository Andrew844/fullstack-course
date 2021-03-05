import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OverviewResponseInterface } from '../types/overviewResponse.interface';
import { AnalyticsResponseInterface } from '../types/analyticsResponse.interface';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  constructor(private http: HttpClient) {}

  getOverview(): Observable<OverviewResponseInterface> {
    return this.http.get<OverviewResponseInterface>('/api/analytics/overview');
  }

  getAnalytics(): Observable<AnalyticsResponseInterface> {
    return this.http.get<AnalyticsResponseInterface>(
      '/api/analytics/analytics'
    );
  }
}
