import requestConfig, { ContentType, Method } from "../configurations/axios.config";
import { ResponseSuccess } from "../dtos/responses/response.success";

export const getVnpPaymentUrl = async (amount: number, bankCode: string = "NCB") : Promise<ResponseSuccess<string>> => {
    const roundAmout = Math.round(amount);
    try {
        const response = await requestConfig(
            `payment/vnp?amount=${roundAmout}&bankCode=${bankCode}`,
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