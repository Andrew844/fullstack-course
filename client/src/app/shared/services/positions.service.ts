import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PositionResponseInterface } from '../types/positionResponse.interface';
import { map } from 'rxjs/operators';
import { PositionInterface } from '../types/position.interface';
import { ResponseMessageInterface } from '../types/responseMessage.interface';

@Injectable({ providedIn: 'root' })
export class PositionsService {
  constructor(private http: HttpClient) {}

  fetch(id: string): Observable<PositionInterface[]> {
    return this.http
      .get<PositionResponseInterface>(`/api/position/${id}`)
      .pipe(map((res: PositionResponseInterface) => res.data));
  }

  create(position: PositionInterface): Observable<PositionInterface> {
    return this.http.post<PositionInterface>('/api/position', position);
  }

  update(position: PositionInterface): Observable<PositionInterface> {
    return this.http.patch<PositionInterface>(
      `/api/position/${position._id}`,
      position
    );
  }

  delete(id: string): Observable<ResponseMessageInterface> {
    return this.http.delete<ResponseMessageInterface>(`/api/position/${id}`);
  }
}
