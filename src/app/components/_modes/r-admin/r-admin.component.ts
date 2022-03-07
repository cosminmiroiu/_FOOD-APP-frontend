import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { CartItem } from 'src/app/entity/cart-item';
import { Order } from 'src/app/entity/order';
import { Restaurant } from 'src/app/entity/restaurant';
import { AuthService } from 'src/app/service/auth.service';
import { OrderService } from 'src/app/service/order.service';
import { RestaurantService } from 'src/app/service/restaurant.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-r-admin',
  templateUrl: './r-admin.component.html',
  styleUrls: ['./r-admin.component.css']
})
export class RAdminComponent implements OnInit {

  userFullName: string = "";
  restaurantId: number = 0;
  restaurant: Restaurant = new Restaurant;

  activeOrders: Order[] = [];
  selectedOrderId: number = 0;
  orderDetails: CartItem[] = [];
  
  allOrdersToday: number = 0;
  acceptedOrdersTodayByCouriers: number = 0;
  deliveringOrdersRightNow: number = 0;
  deliveredOrdersTodayByCouriers: number = 0;
  rejectedOrdersToday: number = 0;

  refreshCheckbox: any;
  refreshTime: number = 5;
  radioAll: any;
  radioNotAccepted: any;
  radioAccepted: any;

  constructor(private authService: AuthService,
              private restaurantService: RestaurantService,
              private orderService: OrderService) { }

  ngOnInit(): void {
    this.refreshCheckbox = <HTMLInputElement> document.getElementById("autoRefresh");
    this.radioAll = <HTMLInputElement> document.getElementById("all");
    this.radioNotAccepted = <HTMLInputElement> document.getElementById("notAccepted");
    this.radioAccepted = <HTMLInputElement> document.getElementById("accepted");
    
    this.userFullName = this.authService.getUserFullName();
    this.getRestaurantId();
  }

  getRestaurantId() {

    this.restaurantId = this.authService.getRestaurantAdminRestaurantId();

    if (this.restaurantId === 0) {
      alert("You don't have access to open this page.");
      this.authService.logout("/forbidden");
      return;
    }

    this.getRestaurant();
  }


  getRestaurant() {
    this.restaurantService.getRestaurantByRestaurantId(this.restaurantId).pipe(take(1)).subscribe({
      next: result => {
        this.restaurant = result;
        this.refreshOrders();
        this.autoRefresh();
      },
      error: error => {
        alert("Error occurred while trying to get restaurant info.\n\nTry to reload the page.");
      }
    });
  }


  refreshOrders() {
    this.getRestaurantActiveOrders();
    this.countTodayPlacedOrdersForRestaurant();
    this.countTodayAcceptedOrdersByCouriersForRestaurant();
    this.countDeliveringRightNow();
    this.countTodayDeliveredOrdersByCouriersByRestaurant();
    this.countTodayRejectedOrdersByRestaurant();
  }


  getRestaurantActiveOrders() {
    this.orderService.getRestaurantActiveOrders().pipe(take(1)).subscribe({
      next: (result: any) => {
        this.activeOrders = result;
        this.selectOrderAfterRefresh();
      },
      error: error => {
        this.activeOrders = [];
      }
    });
  }


  countTodayPlacedOrdersForRestaurant() {
    this.orderService.countTodayPlacedOrdersForRestaurant().pipe(take(1)).subscribe({
      next: result => {
        this.allOrdersToday = Number(result);
      },
      error: error => {
        this.allOrdersToday = 0;
      }
    });
  }


  countTodayAcceptedOrdersByCouriersForRestaurant() {
    this.orderService.countTodayAcceptedOrdersByCouriersByRestaurant().pipe(take(1)).subscribe({
      next: result => {
        this.acceptedOrdersTodayByCouriers = Number(result);
      },
      error: error => {
        this.acceptedOrdersTodayByCouriers = 0;
      }
    });
  }


  countDeliveringRightNow() {
    this.orderService.countDeliveringRightNowByRestaurant().pipe(take(1)).subscribe({
      next: result => {
        this.deliveringOrdersRightNow = Number(result);
      },
      error: error => {
        this.deliveringOrdersRightNow = 0;
      }
    });
  }


  countTodayDeliveredOrdersByCouriersByRestaurant() {
    this.orderService.countTodayDeliveredOrdersByCouriersByRestaurant().pipe(take(1)).subscribe({
      next: result => {
        this.deliveredOrdersTodayByCouriers = Number(result);
      },
      error: error => {
        this.deliveredOrdersTodayByCouriers = 0;
      }
    });
  }


  countTodayRejectedOrdersByRestaurant() {
    this.orderService.countTodayRejectedOrdersByRestaurant().pipe(take(1)).subscribe({
      next: result => {
        this.rejectedOrdersToday = Number(result);
      },
      error: error => {
        this.rejectedOrdersToday = 0;
      }
    });
  }


  displayOrderDetails(order: Order) {

    if (order.selected === true) {
      this.unselectAll();
      return;
    }
    
    this.unselectAll();

    order.selected = true;
    this.selectedOrderId = order.id;

    this.orderService.getOrderedProductsByOrderId(order.id).pipe(take(1)).subscribe({
      next: (result: any) => {
        this.orderDetails = result;
      },
      error: error => {
        alert("Error while trying to display order details.\nPlease retry.");
      }
    });
  }


  unselectAll() {

    this.selectedOrderId = 0;
    this.orderDetails = [];

    for (let i = 0; i < this.activeOrders.length; i++) {
      this.activeOrders[i].selected = false;
    }
  }

  selectOrderAfterRefresh() {

    if (this.selectedOrderId === 0) {
      return;
    }

    for (let i = 0; i < this.activeOrders.length; i++) {
      if (this.activeOrders[i].id === this.selectedOrderId) {
        this.activeOrders[i].selected = true;
        return;
      }
    }

    this.selectedOrderId = 0;
    this.orderDetails = [];
  }


  getOrders(): Order[] {

    if (this.activeOrders.length < 1) {
      return [];
    }
      
    let orders: Order[] = [];

    if (this.radioAll.checked) {
      return this.activeOrders;
    }

    if (this.radioNotAccepted.checked) {
      for (let i = 0; i < this.activeOrders.length; i++) {
        if (this.activeOrders[i].status === "PENDING...") {
          orders.push(this.activeOrders[i]);
        }
      }
      return orders;
    }

    if (this.radioAccepted.checked) {
      for (let i = 0; i < this.activeOrders.length; i++) {
        if (this.activeOrders[i].status === "PREPARING...") {
          orders.push(this.activeOrders[i]);
        }
      }
      return orders;
    }

    return orders;

  }


  getOrderPassedTime(orderDate: Date): string {
    return this.orderService.getOrderPassedTime(orderDate);
  }


  autoRefresh() {
    if (!this.refreshCheckbox.checked) {
      this.refreshTime = 5;
      return;
    }

    if (this.refreshTime > 0) {
      this.refreshTime -= 1;
    } else {
      this.refreshOrders();
      this.refreshTime = 5;
    }

    setTimeout(() => {
      this.autoRefresh();
    }, 1000);
  }


  logout() {
    this.refreshTime = 5;
    this.refreshCheckbox.checked = false;
    this.authService.logout("");
    
    window.location.href = environment.frontendUrl;
  }

}
