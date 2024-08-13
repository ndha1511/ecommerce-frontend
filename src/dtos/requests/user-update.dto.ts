import { Gender } from "../../models/user.model";
import { AddressDto } from "./address.dto";

export type UserUpdateDto = {
    name: string;
    phoneNumber?: string;
    gender?: Gender | null;
    dateOfBirth?: Date | null;
    avatarUrl?: string;
    addressDto?: AddressDto;
}