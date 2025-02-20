import React from 'react';
import {createOrder} from "../../utils/userApi";
import orderDataArray from "../../temp_data/order.json";

export default function Order() {

    const handleOrderRequest = async () => {

        const response = await createOrder(orderDataArray[0]);
        console.log(response);

        if(response.error) {
            console.log(response.error);
        } else {
            console.log("데이터 생성")
        }
    }

    const handleArrOrderRequest = async () => {
        try {
            const responses = await Promise.all(orderDataArray.map(order => createOrder(order)));
            responses.forEach((response, index) => {
                if (response.error) {
                    console.log(`Order ${index + 1} failed: ${response.error}`);
                } else {
                    console.log(`Order ${index + 1} success`);
                }
            });
        } catch (error) {
            console.log("배열 데이터 요청 실패: " + error.message);
        }
    }

    return (
        <>
            <button
                className="btn btn-primary w-100 mb-3"
                onClick={handleOrderRequest}
            >
                테스트 데이터
            </button>

            <button
                className="btn btn-primary w-100 mb-3"
                onClick={handleArrOrderRequest}
            >
                테스트 데이터 20개
            </button>
        </>
    )
}