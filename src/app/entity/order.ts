export class Order {

    id: number;
    restaurantId: number;
    totalQuantity: number;
    totalPrice: number;
    status: string;
    active: boolean;
    reason: string;
    dateCreated: Date;
    dateUpdated: Date;
    shippingAddress: string;
    phoneNumber: string;
    selected: boolean = false;
}

