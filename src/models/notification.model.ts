import { Scope } from "./voucher.model";

export type NotificationModel = {
    id: number;
    content: string;
    notificationDate: Date;
    redirectTo?: string;
    scope: Scope
}