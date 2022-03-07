import { CartItem } from "./cart-item";
import { Order } from "./order";
import { User } from "./user";

export class OrderRequest {

    user: User = new User;
    order: Order = new Order;
    orderProducts: CartItem[] = [];
}
