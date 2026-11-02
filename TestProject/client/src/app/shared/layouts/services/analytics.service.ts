import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AnalyticsPageData, OverviewPageData } from '../../interfaces';

@Injectable({
   providedIn: 'root'
})
export class AnaliticsService {
  constructor(private http: HttpClient) {

  }

  getOverview(): Observable<OverviewPageData> {
    return this.http.get<OverviewPageData>('/api/analytics/overview');
  }

  getAnalytics(): Observable<AnalyticsPageData> {
    return this.http.get<AnalyticsPageData>('/api/analytics/analytics');
  }
}
