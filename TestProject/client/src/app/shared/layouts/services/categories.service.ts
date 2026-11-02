import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category, Message } from '../../interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  constructor(private http: HttpClient) {

  }

  fetch(): Observable<Category[]>{
    return this.http.get<Category[]>('/api/category');
  }

  getById(id: string): Observable<Category> {
    return this.http.get<Category>(`/api/category/${id}`)
  }

  create(name: string, image?: File): Observable<Category> {
    const formDate = new FormData();
    if (image)
      formDate.append('image', image, image.name);

    formDate.append('name', name);


    return this.http.post<Category>('/api/category', formDate)
  }

  update(id:string, name: string, image?: File): Observable<Category> {
    const formDate = new FormData();
    if (image)
      formDate.append('image', image, image.name);

    formDate.append('name', name);


    return this.http.patch<Category>(`/api/category/${id}`, formDate);
  }

  delete(id: string): Observable<Message> {
    return this.http.delete<Message>(`/api/category/${id}`);
  }
}
