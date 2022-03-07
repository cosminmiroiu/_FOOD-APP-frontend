import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/entity/cart-item';
import { CartService } from 'src/app/service/cart.service';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.css']
})
export class CartStatusComponent implements OnInit {

  cartItemsCount: number = 0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.updateCartStatus();
  }

  updateCartStatus() {
    this.cartService.totalQuantity.subscribe(
      data => {
        this.cartItemsCount = data;
      }
    );
  }

}
