import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RestaurantListComponent } from './components/restaurant-list/restaurant-list.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RestaurantService } from './service/restaurant.service';
import { Routes, RouterModule } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { MenuComponent } from './components/menu/menu.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { AuthGuard } from './_authentication/auth.guard';
import { AuthInterceptor } from './_authentication/auth.interceptor';
import { AuthService } from './service/auth.service';
import { LoginComponent } from './components/login/login.component';
import { FormsModule } from '@angular/forms';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { OrderComponent } from './components/order/order.component';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';
import { CourierComponent } from './components/_modes/courier/courier.component';
import { RAdminComponent } from './components/_modes/r-admin/r-admin.component';

const routes: Routes = [
  {path: 'forbidden', component: ForbiddenComponent},
  {path: 'home', component: HomeComponent},
  {path: 'restaurants', component: RestaurantListComponent},
  {path: 'restaurant/:id', component: ProductListComponent},
  {path: 'shopping-cart', component: ShoppingCartComponent},
  {path: 'checkout', component: CheckoutComponent, canActivate:[AuthGuard], data: {role:'STANDARD'}},
  {path: 'orders', component: OrderComponent, canActivate:[AuthGuard], data: {role:'STANDARD'}},
  {path: 'login', component: LoginComponent},
  {path: 'login/:redirectTo', component: LoginComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: '**', redirectTo: '/home', pathMatch: 'full'}
];

@NgModule({
  declarations: [
    AppComponent,
    RestaurantListComponent,
    ProductListComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    CartStatusComponent,
    MenuComponent,
    ShoppingCartComponent,
    LoginComponent,
    CheckoutComponent,
    OrderComponent,
    ForbiddenComponent,
    CourierComponent,
    RAdminComponent,
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    AuthService,
    RestaurantService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
