import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { CartItem } from 'src/app/entity/cart-item';
import { Product } from 'src/app/entity/product';
import { AuthService } from 'src/app/service/auth.service';
import { CartService } from 'src/app/service/cart.service';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  discountedProducts: Product[] = [];

  constructor(private productService: ProductService,
              private cartService: CartService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.getDiscountedProducts();
  }

  isUserLoggedIn(): boolean {
    return this.authService.isUserLoggedIn();
  }

  getDiscountedProducts() {
    this.productService.get5DiscountedProducts().pipe(take(1)).subscribe({
      next: data => {
        this.discountedProducts = data.map(product => Object.assign(new Product(), product));
      }
    });
  }

  addToCart(product: Product) {
    const cartItem = new CartItem(product);
    this.cartService.addToCart(cartItem);
  }

}
