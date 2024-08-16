import requestConfig, { ContentType, Method } from "../configurations/axios.config";
import { ResponseSuccess } from "../dtos/responses/response.success";

export const getDailyRevenue = async () : Promise<ResponseSuccess<number>> => {
    try {
        const response = await requestConfig(
            'statistics/daily-revenue',
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

export const getMonthlyRevenue = async () : Promise<ResponseSuccess<number>> => {
    try {
        const response = await requestConfig(
            'statistics/monthly-revenue',
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

export const getTotalRevenue = async () : Promise<ResponseSuccess<number>> => {
    try {
        const response = await requestConfig(
            'statistics/total-revenue',
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

