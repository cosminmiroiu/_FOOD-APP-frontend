import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { CartItem } from 'src/app/entity/cart-item';
import { Order } from 'src/app/entity/order';
import { Restaurant } from 'src/app/entity/restaurant';
import { AuthService } from 'src/app/service/auth.service';
import { OrderService } from 'src/app/service/order.service';
import { RestaurantService } from 'src/app/service/restaurant.service';

declare var window: any;


@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  activeOrders: Order[] = [];
  closedOrders: Order[] = [];
  orderDetails: CartItem[] = [];
  restaurants: Restaurant[] = [];
  orderDetailsModal: any;

  constructor(private orderService: OrderService,
              private restaurantService: RestaurantService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.orderDetailsModal = new window.bootstrap.Modal(document.getElementById("orderDetailsModal"));
    this.listOrders();
  }

  listOrders() {
    this.restaurantService.getRestaurants().pipe(take(1)).subscribe({
      next: response => {
        this.restaurants = response;
        this.getActiveOrders();
        this.getClosedOrders();
      }
    });
  }

  getActiveOrders() {
    this.orderService.getActiveOrders().pipe(take(1)).subscribe({
      next: (data: any) => {
        this.activeOrders = data;
      }
    });
  }

  getClosedOrders() {
    this.orderService.getClosedOrders().pipe(take(1)).subscribe({
      next: (data: any) => {
        this.closedOrders = data;
      }
    });

    document.getElementById("noOrdersFound").style.display = "block";
  }

  refreshActiveOrders() {
    this.orderService.getActiveOrders().pipe(take(1)).subscribe({
      next: (data: any) => {
        const nrOfActiveOrdersBeforeRefresh: number = this.activeOrders.length;
        this.activeOrders = data;

        if (nrOfActiveOrdersBeforeRefresh != this.activeOrders.length) {
          this.getClosedOrders();
        }
      }
    });
  }

  getOrderedProductsByOrderId(orderId: number) {
    this.orderDetails = [];
    this.orderService.getOrderedProductsByOrderId(orderId).pipe(take(1)).subscribe({
      next: (data: any) => {
        this.orderDetails = data;
        this.orderDetailsModal.show();
      }
    });
  }

  showOrderDetails(orderId: number) {
    this.orderDetails = [];
    this.getOrderedProductsByOrderId(orderId);
  }

  hideOrderDetails() {
    this.orderDetails = [];
    this.orderDetailsModal.hide();
  }

  isOrderRejected(order: Order): boolean {
    if (order.status != "REJECTED") {
      return false;
    }
    return true;
  }

  getRestaurantImageUrl(restaurantId: number): string {
    const restaurantIndex = this.restaurants.findIndex(restaurant => restaurant.id == restaurantId);
    return this.restaurants[restaurantIndex].imageUrl;
  }

  getRestaurantName(restaurantId: number): string {
    const restaurantIndex = this.restaurants.findIndex(restaurant => restaurant.id == restaurantId);
    return this.restaurants[restaurantIndex].restaurantName;
  }

  getOrderPassedTime(orderDate: Date): string {
    return this.orderService.getOrderPassedTime(orderDate);
  }

}
