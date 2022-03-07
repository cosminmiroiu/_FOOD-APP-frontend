import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from '../entity/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private backendUrl = `${environment.backendUrl}/products`;

  constructor(private httpClient: HttpClient) { }

  getProductListByRestaurantId(id: number): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.backendUrl}/restaurant/${id}`);
  }

  getProductsCountByRestaurantId(id: number): Observable<number> {
    return this.httpClient.get<number>(`${this.backendUrl}/count/restaurant/${id}`);
  }

  get5DiscountedProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.backendUrl}/5-discounted-products`);
  }
  
}
