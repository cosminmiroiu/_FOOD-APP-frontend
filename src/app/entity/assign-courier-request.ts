export class AssignCourierRequest {
    courierId: number;
    orderId: number;

    constructor(courierId: number, orderId: number) {
        this.courierId = courierId;
        this.orderId = orderId;
    }
}
