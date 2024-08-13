import { OrderModel } from "./order.model"
import { ProductDetailModel } from "./product-detail.model";

export type OrderDetailModel = {
    order: OrderModel;
    productDetail: ProductDetailModel;
    quantity: number;
    amount: number;
}