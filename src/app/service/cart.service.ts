import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../entity/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalQuantity: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  totalPriceValue: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor() {

    // load shopping cart items from local storage
    let data = JSON.parse(localStorage.getItem('cartItems'));

    if (data != null) {
        this.cartItems = data;
        this.computeCartTotals();
    }
  }

  addToCart(cartItem: CartItem) {

    if (this.isProductFromAnotherRestaurant(cartItem)) {
      if (confirm("\nYou have products in shopping cart from another restaurant.\n\nIf you click OK, shopping cart will be emptied and this one will be added.")) {
        this.emptyCart();
      } else { return; }
    }

    let itemPosition: number = null;

    // check if we already have the item in cart
    for (let i = 0; i < this.cartItems.length; i++) {
      if (this.cartItems[i].productId === cartItem.productId) {
        itemPosition = i;
      }
    }

    // increment quantity of item or add it
    if (itemPosition != null) {
      this.cartItems[itemPosition].incrementQuantity();
    } else {
      this.cartItems.push(cartItem);
    }

    // compute cart total price and total quantity
    this.computeCartTotals();
  }

  isProductFromAnotherRestaurant(cartItem: CartItem): boolean {

    for (let tempCartItem of this.cartItems) {
      if (cartItem.restaurantId != tempCartItem.restaurantId) {
        return true;
      }
    }
    return false;
  }

  removeItemFromCart(cartItem: CartItem) {

    for (let i = 0; i < this.cartItems.length; i++) {
      if (this.cartItems[i].productId === cartItem.productId) {
        this.cartItems.splice(i, 1);
      }
    }

    this.computeCartTotals();
  }

  emptyCart() {
    this.cartItems = [];
    localStorage.removeItem("cartItems");
    this.computeCartTotals();
  }

  computeCartTotals() {

    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.finalPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    // emit new values to all subscribers
    this.totalQuantity.next(totalQuantityValue);
    this.totalPriceValue.next(totalPriceValue);

    // save details to local storage
    this.saveCartItems();
  }

  getTotalPrice(): number {
    return this.totalPriceValue.getValue();
  }

  getTotalQuantity(): number {
    return this.totalQuantity.getValue();
  }

  getCurrentRestaurantId(): number {
    if (this.cartItems.length > 0) {
      return this.cartItems[0].restaurantId;
    } else {
      return 0;
    }
  }

  getCartItems(): CartItem[] {
    if (this.cartItems != null && this.cartItems.length > 0) {
      return this.cartItems;
    } else {
      return null;
    }
  }

  // save cart details to local storage
  saveCartItems() {
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

}
