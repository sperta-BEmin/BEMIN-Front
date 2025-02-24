import React, { useEffect, useState } from 'react';
import Input from "../../../components/Input";
import {comma} from "../../../js/common";

const {
    getMyStore,
    createProduct,
    getProducts,
} = require('../../../utils/userApi');

export default function Menu() {
    const [storeId, setStoreId] = useState(null);
    const [formattedPrice, setFormattedPrice] = useState("");
    const [formData, setFormData] = useState({
        title: "",
        comment: "",
        imageUrl: "",
        price: 0,
    });

    const handleChange = (key, value) => {
        setFormData({
            ...formData,
            [key]: value,
        });
    };

    const handleCommaChange = (key, value) => {
        const rawValue = value.replace(/[^0-9]/g, ""); // 숫자 이외 문자 제거
        setFormData({
            ...formData,
            [key]: rawValue,
        });
        setFormattedPrice(comma(rawValue));
    };

    const handleSubmit = async () => {
        try {
            const res = await createProduct(storeId, formData);
            console.log(res);
        } catch (e) {
            console.log(e);
        }
    }

    const getProductsReq = async () => {
        try {
            const res = await getProducts(storeId, {page: 0, size: 10});
            console.log(res);
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ storeRes ] = await Promise.all([
                    getMyStore()
                ]);

                if (!storeRes || !storeRes.data) {
                    console.error("storeRes 데이터 없음", storeRes);
                    setStoreId(null);
                    return;
                }

                setStoreId(storeRes.data.id);
                console.log(storeRes.data.id);

            } catch(error) {
                console.error("데이터 로드 실패: ", error);
                setStoreId(null);
            }
        }
        fetchData();
    }, [])

    return (
        <div className="container mt-4">
            <h2 className="mb-4 text-center">📋 메뉴 관리</h2>

            {/* 📌 메뉴 추가 폼 */}
            <div className="card p-4 mb-4 shadow-sm">
                <h4>새 메뉴 추가</h4>
                <div className="row g-2">
                    <Input
                        id="new_menu_name"
                        className="col-md-4"
                        type="text"
                        label="메뉴 이름"
                        onChange={(e) => handleChange("title", e.target.value)}
                        placeholder="메뉴 이름"
                    />
                    <Input
                        id="new_menu_price"
                        className="col-md-4"
                        type="text"
                        label="가격"
                        value={formattedPrice}
                        onChange={(e) => handleCommaChange("price", e.target.value)}
                        placeholder="가격"
                    />
                    <Input
                        id="new_menu_url"
                        className="col-md-4"
                        type="text"
                        label="이미지URL"
                        onChange={(e) => handleChange("imageUrl", e.target.value)}
                        placeholder="이미지URL"
                    />
                </div>
                <Input
                    id="new_menu_description"
                    type="text"
                    label="설명"
                    onChange={(e) => handleChange("comment", e.target.value)}
                    placeholder="메뉴 설명"
                />
                <div className="row g-2 justify-content-center">
                    <button className="btn btn-primary mt-3 w-25 border-secondary"
                    onClick={handleSubmit}>
                        추가
                    </button>
                </div>
            </div>
        </div>
    );
}