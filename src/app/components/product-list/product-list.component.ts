import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { CartItem } from 'src/app/entity/cart-item';
import { Product } from 'src/app/entity/product';
import { ProductCategory } from 'src/app/entity/product-category';
import { CartService } from 'src/app/service/cart.service';
import { CategoryService } from 'src/app/service/category.service';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  currentRestaurantName: string = "";
  currentRestaurantImageUrl: string = "";
  products: Product[] = [];
  productCategories: ProductCategory[] = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private categoryService: CategoryService,
              private productService: ProductService,
              private cartService: CartService) { }

  ngOnInit(): void {
    this.getProducts();
    this.getProductCategories();
  }

  getProducts() {

    // route id parameter validation
    if (this.hasRouteValidRestaurantId()) {
      // get current route "id" param
      var currentRestaurantId: number = Number(this.route.snapshot.paramMap.get('id'));

      this.productService.getProductListByRestaurantId(currentRestaurantId).pipe(take(1)).subscribe({
        next: data => {
          if (data.length > 0) {
            this.products = data.map(product => Object.assign(new Product(), product));
            this.currentRestaurantName = this.products[0].restaurant.restaurantName;
            this.currentRestaurantImageUrl = this.products[0].restaurant.imageUrl;
          } else {
            this.router.navigate(['/restaurants']);
          }
        }
      });
    } else {
      // go to home page if route doesn't have param id / valid param id
      this.router.navigate(['/restaurants']);
    }
  }

  getProductCategories() {

    this.categoryService.getProductCategories().pipe(take(1)).subscribe(
      data => {
        if (data.length > 0) {
          this.productCategories = data;
        } else {
          this.router.navigate(['/restaurants']);
        }
      }
    );
  }

  getProductsByCategory(productCategory: ProductCategory): Product[] {

    let products: Product[] = [];

    for (let product of this.products) {
      if (product.category.id === productCategory.id) {
        products.push(product);
      }
    }
   
    return products;
  }

  hasRouteValidRestaurantId(): boolean {
    
    const hasId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasId) {
      let currentRestaurantId: any = this.route.snapshot.paramMap.get('id');
      if (isNaN(currentRestaurantId)) {
        return false;
      } else {
        return true; // param is valid if it exists and if it is a number
      }
    } else {
      return false;
    }
  }

  addToCart(product: Product) {
    let cartItem = new CartItem(product);
    this.cartService.addToCart(cartItem);
  }

}
