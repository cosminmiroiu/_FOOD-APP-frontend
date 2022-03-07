import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { OrderRequest } from 'src/app/entity/order-request';
import { Restaurant } from 'src/app/entity/restaurant';
import { AuthService } from 'src/app/service/auth.service';
import { CartService } from 'src/app/service/cart.service';
import { OrderService } from 'src/app/service/order.service';
import { RestaurantService } from 'src/app/service/restaurant.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  // order information
  totalPrice: number = 0;
  totalQuantity: number = 0;
  userName: string = "";
  userPhoneNumber: string = "";
  userAddress: string = "";
  restaurant: Restaurant = new Restaurant;

  // order id that comes from backend if succesfully
  receivedOrder: string = "";

  constructor(private cartService: CartService,
              private authService: AuthService,
              private restaurantService: RestaurantService,
              private orderService: OrderService,
              private router: Router) { }

  ngOnInit(): void {
    if (this.cartService.getTotalQuantity() > 0) {
      this.getRestaurantDeliveryPrice();
      this.getCartTotals();
      this.getUserInfo();
    } else {
      alert("Add products in cart before entering this page.");
      this.router.navigate(['/restaurants']);
    }
  }

  placeOrder() {

    // creating order request
    let orderRequest = new OrderRequest;

    // populating order request
    orderRequest.user.email = this.authService.getUserEmail();
    orderRequest.order.totalQuantity = this.totalQuantity;
    orderRequest.order.totalPrice = this.totalPrice;
    orderRequest.order.shippingAddress = this.userAddress;
    orderRequest.order.phoneNumber = this.userPhoneNumber;
    orderRequest.order.restaurantId = this.cartService.getCurrentRestaurantId();
    orderRequest.orderProducts = this.cartService.getCartItems();

    // checking if order request has valid data
    if (!this.orderService.orderRequestHasValidData(orderRequest)) {
      alert("Your order contain invalid data. You will be logged out.\nPlease re-login and try again. Sorry for the inconvenient.");
      this.cartService.emptyCart();
      this.authService.logout("/home");
    }

    // post order request
    this.orderService.placeOrder(orderRequest).pipe(take(1)).subscribe({
      next: (response: any) => {
        this.receivedOrder = response;
        this.cartService.emptyCart();
        document.getElementById("checkoutForm").style.display = "none";
        document.getElementById("orderForm").style.display = "flex";
      },
      error: error => {
        alert("Order not placed.\nPlease re-login and try again.\nSorry for the inconvenient.");
        this.authService.logout("/login");
      }
    });
  }

  getCartTotals() {
    this.totalPrice = this.cartService.getTotalPrice();
    this.totalQuantity = this.cartService.getTotalQuantity();
  }

  getUserInfo() {
    this.userName = this.authService.getUserFullName();
    this.userPhoneNumber = this.authService.getUserPhoneNumber();
    this.userAddress = this.authService.getUserAddress();
  }

  getRestaurantDeliveryPrice() {
    this.restaurantService.getRestaurantByRestaurantId(this.cartService.getCurrentRestaurantId()).pipe(take(1)).subscribe({
      next: restaurantData => {
        this.restaurant = restaurantData;
      },
      error: error => {
        alert("Something is wrong. Please refresh.");
        this.router.navigate(['/shopping-cart']);
        window.location.reload();
      }
    });
  }

}
