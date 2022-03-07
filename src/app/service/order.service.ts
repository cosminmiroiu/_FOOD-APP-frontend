import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AssignCourierRequest } from '../entity/assign-courier-request';
import { Order } from '../entity/order';
import { OrderRequest } from '../entity/order-request';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private backendUrl = `${environment.backendUrl}/orders`;

  constructor(private httpClient: HttpClient,
    private authService: AuthService) { }

  // courier user
  countTodayOrders() {
    return this.httpClient.get(`${this.backendUrl}/count/today`);
  }

  // courier user
  countTodayOrdersAcceptedByCourier() {
    const courierId: number = this.authService.getUserId();
    return this.httpClient.get(`${this.backendUrl}/count/courier/accepted/today/${courierId}`);
  }

  // courier user
  countTodayDeliveredOrdersByCourier() {
    const courierId: number = this.authService.getUserId();
    return this.httpClient.get(`${this.backendUrl}/count/courier/delivered/today/${courierId}`);
  }

  // courier user
  countTodayRejectedOrdersByCourier() {
    const courierId: number = this.authService.getUserId();
    return this.httpClient.get(`${this.backendUrl}/count/courier/rejected/today/${courierId}`);
  }

  // restaurant admin user
  countTodayPlacedOrdersForRestaurant() {
    const restaurantId: number = this.authService.getRestaurantAdminRestaurantId();
    return this.httpClient.get(`${this.backendUrl}/count/restaurant/today/${restaurantId}`);
  }

  // restaurant admin user
  countTodayAcceptedOrdersByCouriersByRestaurant() {
    const restaurantId: number = this.authService.getRestaurantAdminRestaurantId();
    return this.httpClient.get(`${this.backendUrl}/count/restaurant/accepted/today/${restaurantId}`);
  }

  // restaurant admin user
  countDeliveringRightNowByRestaurant() {
    const restaurantId: number = this.authService.getRestaurantAdminRestaurantId();
    return this.httpClient.get(`${this.backendUrl}/count/restaurant/delivering/${restaurantId}`);
  }

  // restaurant admin user
  countTodayDeliveredOrdersByCouriersByRestaurant() {
    const restaurantId: number = this.authService.getRestaurantAdminRestaurantId();
    return this.httpClient.get(`${this.backendUrl}/count/restaurant/delivered/${restaurantId}`);
  }

  // restaurant admin user
  countTodayRejectedOrdersByRestaurant() {
    const restaurantId: number = this.authService.getRestaurantAdminRestaurantId();
    return this.httpClient.get(`${this.backendUrl}/count/restaurant/rejected/${restaurantId}`);
  }

  // restaurant admin user
  getRestaurantActiveOrders() {
    const restaurantId: number = this.authService.getRestaurantAdminRestaurantId();
    return this.httpClient.get(`${this.backendUrl}/active/restaurant/${restaurantId}`);
  }

  // courier user
  getCourierOrders() {
    const userId: number = this.authService.getUserId();
    return this.httpClient.get(`${this.backendUrl}/active/assignedTo/${userId}`);
  }

  // courier user
  getAvailableOrders() {
    return this.httpClient.get(`${this.backendUrl}/active/assignedTo/0`);
  }

  // courier user
  assignCourierToOrder(assignCourierRequest: AssignCourierRequest) {
    return this.httpClient.put(`${this.backendUrl}/courier/assignCourier`, assignCourierRequest, { responseType: 'text' });
  }

  // courier user
  setOrderPickedByCourier(orderId: number) {
    return this.httpClient.put(`${this.backendUrl}/courier/pickOrder`, orderId, { responseType: 'text' });
  }

  // courier user
  autoAcceptOrder() {
    const courierId: number = this.authService.getUserId();
    return this.httpClient.put(`${this.backendUrl}/courier/autoAcceptOrder`, courierId, { responseType: 'text' });
  }

  // courier user
  setOrderAsDelivered(orderId: number) {
    return this.httpClient.put(`${this.backendUrl}/courier/successfullyDelivered`, orderId, { responseType: 'text' });
  }

  // basic user / restaurant admin
  getOrderedProductsByOrderId(orderId: number) {
    return this.httpClient.get(`${this.backendUrl}/orderedProducts/${orderId}`);
  }

  // basic user
  placeOrder(orderRequest: OrderRequest) {
    return this.httpClient.post(`${this.backendUrl}/add`, orderRequest, { responseType: 'text' });
  }

  // basic user
  getActiveOrders() {
    const userId = this.authService.getUserId();
    return this.httpClient.get(`${this.backendUrl}/active/user/${userId}`);
  }

  // basic user
  getClosedOrders() {
    const userId = this.authService.getUserId();
    return this.httpClient.get(`${this.backendUrl}/closed/user/${userId}`);
  }

  getOrderPassedTime(orderDate: Date): string {
    const now = new Date();
    const placedDate: Date = new Date(orderDate);
    const minutes: number = (now.getTime() - placedDate.getTime()) / 60000;

    switch (true) {
      case (minutes <= 60 && minutes >= 1): {
        if (minutes.toFixed() === '1') { return `${minutes.toFixed()} minute ago`; }
        return `${minutes.toFixed()} minutes ago`;
      }
      case (minutes > 60 && minutes <= 1380): {
        if ((minutes / 60).toFixed() === '1') { return `${(minutes / 60).toFixed()} hour ago`; }
        return `${(minutes / 60).toFixed()} hours ago`;
      }
      case (minutes > 1380): {
        if ((minutes / 60 / 24).toFixed() === '1') { return `${(minutes / 60 / 24).toFixed()} day ago`; }
        return `${(minutes / 60 / 24).toFixed()} days ago`;
      }
      default:
        return `${(minutes * 60).toFixed()} seconds ago`;
    }
  }

  orderRequestHasValidData(orderRequest: OrderRequest): boolean {

    if (orderRequest.user.email != null &&
      orderRequest.user.email != "" &&
      orderRequest.order.restaurantId != null &&
      orderRequest.order.restaurantId > 0 &&
      orderRequest.order.totalPrice > 0 &&
      orderRequest.order.totalQuantity > 0 &&
      orderRequest.order.shippingAddress != null &&
      orderRequest.order.shippingAddress != "" &&
      orderRequest.orderProducts.length > 0) {
      return true;
    } else {
      return false;
    }
  }

}
