import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { AssignCourierRequest } from 'src/app/entity/assign-courier-request';
import { Order } from 'src/app/entity/order';
import { Restaurant } from 'src/app/entity/restaurant';
import { AuthService } from 'src/app/service/auth.service';
import { OrderService } from 'src/app/service/order.service';
import { RestaurantService } from 'src/app/service/restaurant.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-courier',
  templateUrl: './courier.component.html',
  styleUrls: ['./courier.component.css']
})
export class CourierComponent implements OnInit {

  restaurants: Restaurant[] = [];
  availableOrders: Order[] = [];
  courierOrders: Order[] = [];
  userFullName: string = "";

  allOrdersToday: number = 0;
  acceptedOrdersTodayByCourier: number = 0;
  deliveredOrdersTodayByCourier: number = 0;
  rejectedOrdersTodayByCourier: number = 0;

  refreshCheckbox: any;
  autoAcceptCheckbox: any;
  refreshTime: number = 5;

  constructor(private orderService: OrderService,
              private authService: AuthService,
              private restaurantService: RestaurantService) { }

  ngOnInit(): void {
    this.refreshCheckbox = <HTMLInputElement> document.getElementById("autoRefresh");
    this.autoAcceptCheckbox = <HTMLInputElement> document.getElementById("autoAccept");
    this.userFullName = this.authService.getUserFullName();

    this.listOrders();
  }

  listOrders() {
    this.restaurantService.getRestaurants().pipe(take(1)).subscribe({
      next: response => {
        this.restaurants = response;
        this.refreshOrders();
        this.autoRefresh();
      },
      error: error => {
        this.refreshCheckbox.checked = false;
      }
    });
  }

  refreshOrders() {
    this.countTodayOrders();
    this.countTodayAcceptedOrdersByCourier();
    this.countTodayDeliveredOrdersByCourier();
    this.countTodayRejectedOrdersByCourier();
    this.getAvailableOrders();
    this.getCourierOrders();
  }

  autoRefresh() {

    if (!this.refreshCheckbox.checked) {
      this.refreshTime = 5;
      return;
    }

    if (this.refreshTime > 0) {
      this.refreshTime -= 1;
    } else {
      if (this.autoAcceptCheckbox.checked && this.courierOrders.length < 1) {
        this.autoAcceptOrder();
      }
      this.refreshOrders();
      this.refreshTime = 5;
    }

    setTimeout(() => {
      this.autoRefresh();
    }, 1000);
  }

  autoAcceptOrders () {
    if (this.autoAcceptCheckbox.checked) {
      if(!this.refreshCheckbox.checked) {
        this.refreshCheckbox.checked = true;
        this.autoRefresh();
      }
    }
  }

  getAvailableOrders() {
    this.orderService.getAvailableOrders().pipe(take(1)).subscribe({
      next: (result: any) => {
        this.availableOrders = result;
      },
      error: error => {
        this.refreshCheckbox.checked = false;
      }
    });
  }

  getCourierOrders() {
    this.orderService.getCourierOrders().pipe(take(1)).subscribe({
      next: (result: any) => {
        this.courierOrders = result;
      },
      error: error => {
        this.refreshCheckbox.checked = false;
      }
    });
  }

  autoAcceptOrder() {
    this.orderService.autoAcceptOrder().pipe(take(1)).subscribe({
      next: result => {
        this.refreshOrders();
      },
      error: error => {
        this.refreshCheckbox.checked = false;
      }
    });
  }

  acceptOrder(orderId: number) {

    let assignCourierRequest = new AssignCourierRequest(this.authService.getUserId(), orderId);
    this.orderService.assignCourierToOrder(assignCourierRequest).pipe(take(1)).subscribe({
      next: (response: any) => {
        if (String(response) != "Order successfully accepted!") {
          alert(String(response));
        }
        this.refreshOrders();
      },
      error: error => {
        this.refreshCheckbox.checked = false;
      }
    });

  }

  pickOrder(orderId: number) {

    if(!confirm("ORDER PICKED UP FROM RESTAURANT CHECK\n\nConfirm?")) {
      return;
    }

    this.orderService.setOrderPickedByCourier(orderId).pipe(take(1)).subscribe({
      next: (response: any) => {
        if(String(response) != "Order successfully picked up!") {
          alert(String(response));
        }
        this.refreshOrders();
      },
      error: error => {
        this.refreshCheckbox.checked = false;
      }
    });
  }

  deliverOrder(orderId: number) {

    if(!confirm("ORDER DELIVERED TO CLIENT CHECK\n\nConfirm?")) {
      return;
    }

    this.orderService.setOrderAsDelivered(orderId).pipe(take(1)).subscribe({
      next: (response: any) => {
        if (String(response) != "Order successfully set as delivered!") {
          alert(String(response));
        }
        this.refreshOrders();
      },
      error: error => {
        this.refreshCheckbox.checked = false;
      }
    });
  }

  countTodayOrders() {
    this.orderService.countTodayOrders().pipe(take(1)).subscribe({
      next: result => {
        this.allOrdersToday = Number(result);
      },
      error: error => {
        this.refreshCheckbox.checked = false;
        this.allOrdersToday = 0;
      }
    });
  }

  countTodayAcceptedOrdersByCourier() {

    const courierId: number = this.authService.getUserId();

    this.orderService.countTodayOrdersAcceptedByCourier().pipe(take(1)).subscribe({
      next: result => {
        this.acceptedOrdersTodayByCourier = Number(result);
      },
      error: error => {
        this.refreshCheckbox.checked = false;
        this.acceptedOrdersTodayByCourier = 0;
      }
    });
  }

  countTodayDeliveredOrdersByCourier() {

    const courierId: number = this.authService.getUserId();

    this.orderService.countTodayDeliveredOrdersByCourier().pipe(take(1)).subscribe({
      next: result => {
        this.deliveredOrdersTodayByCourier = Number(result);
      },
      error: error => {
        this.refreshCheckbox.checked = false;
        this.deliveredOrdersTodayByCourier = 0;
      }
    });
  }

  countTodayRejectedOrdersByCourier() {

    const courierId: number = this.authService.getUserId();

    this.orderService.countTodayRejectedOrdersByCourier().pipe(take(1)).subscribe({
      next: result => {
        this.rejectedOrdersTodayByCourier = Number(result);
      },
      error: error => {
        this.refreshCheckbox.checked = false;
        this.rejectedOrdersTodayByCourier = 0;
      }
    });
  }

  getNextAction(order: Order): string {
    
    switch(order.status) {
      case "PREPARING...":
        return "pick the order from restaurant";
      case "DELIVERING...":
        return "deliver order to client address";
      default:
        return "order error. please report to admin";
    }
  }

  getOrderPassedTime(orderDate: Date): string {
    return this.orderService.getOrderPassedTime(orderDate);
  }

  getRestaurantImageUrl(restaurantId: number): string {
    const restaurantIndex = this.restaurants.findIndex(restaurant => restaurant.id == restaurantId);
    return this.restaurants[restaurantIndex].imageUrl;
  }

  getRestaurantAddress(restaurantId: number): string {
    const restaurantIndex = this.restaurants.findIndex(restaurant => restaurant.id == restaurantId);
    return this.restaurants[restaurantIndex].restaurantAddress;
  }

  getRestaurantName(restaurantId: number): string {
    const restaurantIndex = this.restaurants.findIndex(restaurant => restaurant.id == restaurantId);
    return this.restaurants[restaurantIndex].restaurantName;
  }

  logout() {
    this.authService.logout("");
    window.location.href = environment.frontendUrl;
  }

}