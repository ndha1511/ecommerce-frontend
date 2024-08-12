import { ProductDetailModel } from "./product-detail.model"

export type CartItemModel = {
    productDetail: ProductDetailModel;
    quantity: number;
    discountedPrice?: number;
}