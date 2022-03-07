import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { Restaurant } from 'src/app/entity/restaurant';
import { ProductService } from 'src/app/service/product.service';
import { RestaurantService } from 'src/app/service/restaurant.service';

@Component({
  selector: 'app-restaurant-list',
  templateUrl: './restaurant-list.component.html',
  styleUrls: ['./restaurant-list.component.css']
})
export class RestaurantListComponent implements OnInit {

  restaurants: Restaurant[] = [];

  constructor(private restaurantService: RestaurantService,
              private productService: ProductService) { }

  ngOnInit(): void {
    this.getRestaurantList();
  }

  getRestaurantList() {
    this.restaurantService.getRestaurants().pipe(take(1)).subscribe({
      next: data => {
        this.restaurants = data;
        this.getNumberOfProductsForAllRestaurants();
      }
    });
  }

  getNumberOfProductsForAllRestaurants() {
    for (let restaurant of this.restaurants) {
      this.getProductsCountByRestaurantId(restaurant.id);
    }
  }

  getProductsCountByRestaurantId(id: number) {
    this.productService.getProductsCountByRestaurantId(id).pipe(take(1)).subscribe({
      next: data => {
        let restaurantIndex = this.restaurants.findIndex(restaurant => restaurant.id == id);
        this.restaurants[restaurantIndex].productsCount = data;
      }
    });
  }

}
