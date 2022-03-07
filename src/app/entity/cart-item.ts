import { Product } from "./product";

export class CartItem {
    
    productId: number;
    restaurantId: number;
    productName: string;
    productDescription: string;
    productImageUrl: string;
    productUnitPrice: number;
    productDiscountPercent: number;
    quantity: number;
    finalPrice: number;

    constructor(product: Product) {
        this.productId = product.id;
        this.restaurantId = product.restaurant.id;
        this.productName = product.name;
        this.productDescription = product.description;
        this.productImageUrl = product.imageUrl;
        this.productUnitPrice = product.unitPrice;
        this.productDiscountPercent = product.discountPercent;
        this.quantity = 1;
        this.finalPrice = product.unitPrice - (product.unitPrice * product.discountPercent / 100);
    }

    updateFinalPrice() {
        this.finalPrice = (this.productUnitPrice - (this.productUnitPrice * this.productDiscountPercent / 100)) * this.quantity;
    }

    incrementQuantity() {
        this.quantity++;
        this.updateFinalPrice();
    }

    decrementQuantity() {
        if (this.quantity > 1) {
            this.quantity--;
            this.updateFinalPrice();
        }
    }

}
