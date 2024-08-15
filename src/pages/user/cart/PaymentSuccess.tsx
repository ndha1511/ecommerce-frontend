import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { paymentSuccess } from "../../../services/payment.service";

const PaymentSuccess = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const orderId= queryParams.get("orderId");
    const code = queryParams.get("code");

    useEffect(() => {
        (async () => {
            const response = await paymentSuccess(orderId || "", code || "");
            window.location.href = '/orders/' + response.data;
        })();
    }, [])
    return (
        <div>Thanh toán thành công</div>
    );
}

export default PaymentSuccess;