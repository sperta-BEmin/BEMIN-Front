import React from 'react';
import {createOrder} from "../../utils/userApi";

export default function Order() {
    const data = {
        "storeId": "550e8400-e29b-41d4-a716-446655440000",
        "orderType": 1,
        "storeName": "아 죽고싶어요",
        "address": {
            "bcode": "4145011100",
            "jibunAddress": "경기 하남시 미사동 609",
            "roadAddress": "경기 하남시 미사대로 261-2",
            "detailAddress": "302동"
        },
        "products": [
            {
                "productId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                "productName": "Americano",
                "quantity": 2,
                "price": 4000
            },
            {
                "productId": "1b4e28ba-2fa1-11d2-883f-0016d3cca427",
                "productName": "Latte",
                "quantity": 1,
                "price": 4500
            }
        ]
    }

    const handleOrderRequest = async () => {

        const response = await createOrder(data);
        console.log(response);

        if(response.error) {
            console.log(response.error);
        } else {
            console.log("데이터 생성")
        }
    }

    return (
        <button className="btn btn-primary w-100"
            onClick={handleOrderRequest}
        >
            테스트 데이터
        </button>
    )
}