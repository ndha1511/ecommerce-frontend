import requestConfig, { ContentType, Method } from "../configurations/axios.config";
import { OrderDto } from "../dtos/requests/order.dto";
import { PageResponse } from "../dtos/responses/page-response";
import { ResponseSuccess } from "../dtos/responses/response.success";
import { OrderStatus } from "../models/enums/order-status.enum";
import { OrderDetailModel } from "../models/order-detail.model";
import { OrderModel } from "../models/order.model";

export const createOrder = async (orderDto: OrderDto): Promise<ResponseSuccess<OrderModel>> => {
    try {
        const response = await requestConfig(
            `orders`,
            Method.POST,
            orderDto,
            ContentType.JSON,
            true
        );
        return response.data;
    } catch (error) {
        return Promise.reject(error);
    }
}


export const getPageOrders = async (pageNo: number = 1, pageSize: number = 40, search: {
    field: string;
    operator: string;
    value: string;
}[] = [],
    sort: {
        field: string;
        order: string;
    }[] = []): Promise<ResponseSuccess<PageResponse<OrderModel[]>>> => {
    let sortResult : string = 'sort=""';
    let searchResult : string = 'search=""';
    
    if(search.length > 0){
        searchResult = search.map(s => `search=${s.field}${s.operator}${s.value}`).join('&');
    }
    
    if(sort.length > 0){
        sortResult = sort.map(s => `sort=${s.field}:${s.order}`).join('&');
    }

    try {
        const response = await requestConfig(
            `orders?pageNo=${pageNo}&pageSize=${pageSize}&${sortResult}&${searchResult}`,
            Method.GET,
            [],
            ContentType.JSON,
            true
        );
        return response.data;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const updateOrder = async (orderId: string, newOrder: any): Promise<ResponseSuccess<OrderModel>> => {
    try {
        const response = await requestConfig(
            `orders/${orderId}`,
            Method.PATCH,
            newOrder,
            ContentType.JSON,
            true
        );
        return response.data;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const getOrderDetailsByOrderId = async (orderId: string): Promise<ResponseSuccess<OrderDetailModel[]>> => {
    try {
        const response = await requestConfig(
            `order-details/${orderId}`,
            Method.GET,
            [],
            ContentType.JSON,
            true
        );
        return response.data;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const getOrderById = async (orderId: string): Promise<ResponseSuccess<OrderModel>> => {
    try {
        const response = await requestConfig(
            `orders/${orderId}`,
            Method.GET,
            [],
            ContentType.JSON,
            true
        );
        return response.data;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const updateStatusOrder = async (orderId: string, orderUpdateDto: {
    status: OrderStatus
}): Promise<ResponseSuccess<OrderModel>> => {
    try {
        const response = await requestConfig(
            `orders/${orderId}`,
            Method.PUT,
            orderUpdateDto,
            ContentType.JSON,
            true
        );
        return response.data;
    } catch (error) {
        return Promise.reject(error);
    }
}