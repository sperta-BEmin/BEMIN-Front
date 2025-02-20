import React from 'react';
import {createOrder, createCategory, getCategories} from "../../utils/userApi";
import orderDataArray from "../../temp_data/order.json";
import {foodCategoryArr} from "../../utils/FoodCategoryArr";

export default function Order() {

    const btnClassName = "btn btn-primary w-100 mb-3";

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

    const handleArrCategoryRequest = async () => {
        try {
            const responses = await Promise.all(foodCategoryArr.map(category => createCategory({ name: category.name })));
            responses.forEach((response, index) => {
                if (response.error) {
                    console.log(`Category ${index + 1} failed: ${response.error}`);
                } else {
                    console.log(`Category ${index + 1} success`);
                }
            })
        } catch (error) {
            console.log("Category Post Arr request failed: " + error.message);
        }
    }

    const getArrCategoriesReq = async () => {
        try {
            const response = await getCategories();
            console.log(response);
        } catch (error) {
            console.log("Category get Arr req failed: " + error.message);
        }
    }



    return (
        <div className="container-sm">
            <div className="row justify-content-center">
                <div className="col-md-6 card p-3">
                    <button
                        className={btnClassName}
                        onClick={getArrCategoriesReq}
                    >
                        카테고리 데이터들 가져오기
                    </button>
                    <button
                        className={btnClassName}
                        onClick={handleArrCategoryRequest}
                    >
                        카테고리 데이터들 생성(CUSTOMER이 아닌 다른 계정, 최초 한번만 클릭하세요)
                    </button>
                    <button
                        className={btnClassName}
                        onClick={handleArrOrderRequest}
                    >
                        오더 데이터 20개 생성(로그인 필요)
                    </button>
                </div>
            </div>
        </div>
    )
}