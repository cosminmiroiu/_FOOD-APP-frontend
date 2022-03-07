import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { Restaurant } from '../entity/restaurant';
import { environment } from 'src/environments/environment';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  private restaurantsUrl = `${environment.backendUrl}/restaurants`;

  constructor(private httpClient: HttpClient, 
              private productService: ProductService) { }

  getRestaurants(): Observable<Restaurant[]> {
    return this.httpClient.get<Restaurant[]>(this.restaurantsUrl);
  }

  getRestaurantByRestaurantId(id: number): Observable<Restaurant> {
    return this.httpClient.get<Restaurant>(`${this.restaurantsUrl}/${id}`);
  }

}