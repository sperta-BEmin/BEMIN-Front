import React, {useEffect, useState} from 'react';
import {createStore, getCategories} from "../../../utils/userApi";
import CheckBox from "../../../components/CheckBox";
import Input from "../../../components/Input";
import {comma} from "../../../js/common";

export default function Master() {
    const btnClassName = "btn w-100 mb-3 "

    const [categories, setCategories] = useState([]);
    const [seletedCategories, setSeletedCategories] = useState([]);
    const [formattedPrice, setFormattedPrice] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        minimumPrice: 0,
        userEmail: "",
        zoneCode: "",
        bcode: "",
        jibunAddress: "",
        roadAddress: "",
        detail: "",
        categoryIds: []
    })

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

    const getArrCategoriesReq = async () => {
        try {
            const res = await getCategories();
            const formattedCategories = res.data.content.map((category) => ({
                label: category.name,
                value: category.categoryId
            }));
            setCategories(formattedCategories);
        } catch (e) {
            console.log("Category get Arr req failed: " + e.message);
        }
    }

    // Daum Postcode API를 로드하는 함수
    const loadDaumPostcodeScript = () => {
        const script = document.createElement("script");
        script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
        script.async = true; // 비동기로 로드
        document.body.appendChild(script);

        script.onload = () => {
            console.log("다음 Post API 로드 성공");
        };

        script.onerror = () => {
            console.error("다음 Post API 로드 실패");
        };
    };

    const openDaumPostcode = () => {
        new window.daum.Postcode({
            oncomplete: function (data) {
                // 다음 주소 검색 데이터 console.log
                console.log(data);
                // 주소 검색 결과를 formData에 반영
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    zoneCode: data.zonecode,
                    bcode: data.bcode,
                    jibunAddress: data.jibunAddress,
                    roadAddress: data.roadAddress,
                }));
            },
        }).open();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.categoryIds.length <= 0) return;
        try {
            const res = await createStore(formData);
            console.log(res);
        } catch (e) {
            console.log("Can not create Store : " + e);
        }
    }

    useEffect(() => {
        async function fetchData() {
            await loadDaumPostcodeScript();
            await getArrCategoriesReq();
        }
        fetchData();
    }, []);

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            categoryIds: seletedCategories,
        }))
    }, [seletedCategories]);

    return (
        <div className="container-sm">
            <div className="row justify-content-center">
                <div className="col-md-7 card p-3">
                    <form onSubmit={handleSubmit}>
                        <Input
                            id="name"
                            label="가게 이름"
                            placeholder="가게 이름일 입력하세요."
                            type="text"
                            onChange={(e) => handleChange("name", e.target.value)}
                        />
                        <Input
                            id="userEmail"
                            label="이메일"
                            placeholder="이메일을 입력하세요"
                            type="text"
                            onChange={(e) => handleChange("userEmail", e.target.value)}
                        />
                        <Input
                            id="phone"
                            label="전화번호"
                            placeholder="가게 전화번호를 입력하세요."
                            type="tel"
                            onChange={(e) => handleChange("phone", e.target.value)}
                        />
                        <Input
                            id="minimumPrice"
                            label="최소 주문 금액"
                            placeholder="최소 주문 금액을 입력하세요."
                            type="text"
                            value={formattedPrice}
                            onChange={(e) => handleCommaChange("minimumPrice", e.target.value)}
                        />
                        <div className="mb-3">
                            <button
                                type="button"
                                className="btn btn-success mt-2 w-100"
                                onClick={openDaumPostcode}
                            >
                                주소 검색
                            </button>
                            <Input
                                type="text"
                                id="jibunAddress"
                                label="지번 주소"
                                placeholder="주소를 검색해주세요."
                                value={formData.jibunAddress}
                                readOnly={true}
                            />
                            <Input
                                type="text"
                                id="roadAddress"
                                label="도로명 주소"
                                placeholder="주소를 검색해주세요."
                                value={formData.roadAddress}
                                readOnly={true}
                            />
                            <Input
                                label="상세 주소"
                                id="detail"
                                type="text"
                                placeholder="상세 주소를 입력해주세요."
                                value={formData.detail}
                                onChange={(e) => handleChange("detail", e.target.value)}
                            />
                        </div>
                        <CheckBox
                            options={categories}
                            min={1}
                            max={4}
                            selected={seletedCategories}
                            onChange={setSeletedCategories}
                        />
                        <button type="submit" className={btnClassName + "btn-primary"}>
                            가게 만들기
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}