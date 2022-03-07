import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartItem } from 'src/app/entity/cart-item';
import { Product } from 'src/app/entity/product';
import { AuthService } from 'src/app/service/auth.service';
import { CartService } from 'src/app/service/cart.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

  cartItems: CartItem[] = [];
  totalPriceValue: number = 0;

  constructor(private cartService: CartService,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.getCartItems();
    this.getTotalPriceValue();
  }

  getCartItems() {
    this.cartItems = this.cartService.cartItems;
  }

  getTotalPriceValue() {
    this.cartService.totalPriceValue.subscribe(
      data => {
        this.totalPriceValue = data;
      }
    );
  }

  removeItemFromCart(cartItem: CartItem) {
    this.cartService.removeItemFromCart(cartItem);
  }

  emptyCart() {
    this.cartService.emptyCart();
    this.cartItems = [];
  }

  goToCheckout() {
    if (this.authService.isUserLoggedIn()) {
      this.router.navigate(['/checkout']);
    } else {
      this.router.navigate(['/login/checkout']);
    }
  }

}
