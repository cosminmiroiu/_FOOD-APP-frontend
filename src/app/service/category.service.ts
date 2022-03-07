import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProductCategory } from '../entity/product-category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private backendUrl = `${environment.backendUrl}/categories`;

  constructor(private httpClient: HttpClient) { }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<ProductCategory[]>(`${this.backendUrl}/all`);
  }
}
