import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CategoryResponseInterface } from '../types/categoryResponse.interface';
import { CategoryInterface } from '../types/category.interface';
import { ResponseMessageInterface } from '../types/responseMessage.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor(private http: HttpClient) {}

  fetch(): Observable<CategoryInterface[]> {
    return this.http
      .get<CategoryResponseInterface>('/api/category')
      .pipe(map((data: CategoryResponseInterface) => data.categories));
  }

  getById(id: string): Observable<CategoryInterface> {
    return this.http.get<CategoryInterface>(`/api/category/${id}`);
  }

  create(name: string, image?: File): Observable<CategoryInterface> {
    const fd: FormData = new FormData();

    fd.append('name', name);

    if (image) {
      fd.append('image', image, image.name);
    }

    return this.http.post<CategoryInterface>('/api/category', fd);
  }

  update(
    id: string,
    name: string,
    image?: File
  ): Observable<CategoryInterface> {
    const fd: FormData = new FormData();

    fd.append('name', name);

    if (image) {
      fd.append('image', image, image.name);
    }

    return this.http.patch<CategoryInterface>(`/api/category/${id}`, fd);
  }

  delete(id: string): Observable<ResponseMessageInterface> {
    return this.http.delete<ResponseMessageInterface>(`/api/category/${id}`);
  }
}
