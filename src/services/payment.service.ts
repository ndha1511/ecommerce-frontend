import requestConfig, { ContentType, Method } from "../configurations/axios.config";
import { ResponseSuccess } from "../dtos/responses/response.success";

export const getVnpPaymentUrl = async (orderId: string, amount: number, bankCode: string = "NCB") : Promise<ResponseSuccess<string>> => {
    const roundAmout = Math.round(amount);
    try {
        const response = await requestConfig(
            `payment/vnp/${orderId}?amount=${roundAmout}&bankCode=${bankCode}`,
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

export const paymentSuccess = async (orderId: string, code: string) : Promise<ResponseSuccess<string>> => {
    try {
        const response = await requestConfig(
            `payment/vnp/payment-success?orderId=${orderId}&code=${code}`,
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