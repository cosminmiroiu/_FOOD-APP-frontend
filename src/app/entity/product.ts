import { ProductCategory } from "./product-category";
import { Restaurant } from "./restaurant";

export class Product {
    id: number;
    category: ProductCategory;
    restaurant: Restaurant;
    name: string;
    description: string;
    unitPrice: number = 0;
    discountPercent: number = 0;
    imageUrl: string;
    active: boolean;
    dateCreated: Date;
    lastUpdated: Date;

    constructor() {}

    applyDiscount(): number {
        return this.unitPrice - (this.unitPrice * this.discountPercent / 100);
      }
}
