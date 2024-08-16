import requestConfig, { ContentType, Method } from "../configurations/axios.config";
import { PageResponse } from "../dtos/responses/page-response";
import { ResponseSuccess } from "../dtos/responses/response.success";
import { RoomModel } from "../models/room.model";

export const getRoomsByEmail = async (email: string, pageNo: number = 1, pageSize: number = 10): 
Promise<ResponseSuccess<PageResponse<RoomModel[]>>> => {
    try {
        const response = await requestConfig(
            `rooms/${email}?pageNo=${pageNo}&pageSize=${pageSize}`,
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