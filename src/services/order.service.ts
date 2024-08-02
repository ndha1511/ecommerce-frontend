import requestConfig, { ContentType, Method } from "../configurations/axios.config";
import { OrderDto } from "../dtos/requests/order.dto";
import { PageResponse } from "../dtos/responses/page-response";
import { ResponseSuccess } from "../dtos/responses/response.success";
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