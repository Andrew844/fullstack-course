import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderInterface } from '../types/order.interface';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  constructor(private http: HttpClient) {}

  fetch(params: any = {}): Observable<OrderInterface[]> {
    return this.http.get<OrderInterface[]>('/api/orders', {
      params: new HttpParams({
        fromObject: params,
      }),
    });
  }

  create(order: OrderInterface): Observable<OrderInterface> {
    return this.http.post<OrderInterface>('/api/orders', order);
  }
}
