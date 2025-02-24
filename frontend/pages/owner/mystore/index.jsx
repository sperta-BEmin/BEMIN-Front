import React, { useEffect, useState } from "react";
import BtnInput from "../../../components/BtnInput";
import {comma} from "../../../js/common";
import Input from "../../../components/Input";
import CheckBox from "../../../components/CheckBox";

const {
    getCategories,
    getMyStore,
    patchMinPrice,
    patchStoreAddress, patchStoreCategories,
    patchStoreName,
    patchStorePhone
} = require("../../../utils/userApi");

export default function MyStore() {
    const [myStore, setMyStore] = useState(null);
    const [categories, setCategories] = useState([]);
    const [formattedPrice, setFormattedPrice] = useState(0);
    const [seletedCategories, setSeletedCategories] = useState([]);

    const handleInputChange = (key, value) => {
        setMyStore((prevStore) => ({
            ...prevStore,
            [key]: value,
        }));
    };

    const handleAddressChange = (key, value) => {
        setMyStore((prevStore) => ({
            ...prevStore,
            storeAddress: {
                ...prevStore.storeAddress,
                [key]: value,
            }
        }))
    }

    const handleCommaChange = (key, value) => {
        const rawValue = value.replace(/[^0-9]/g, "");
        setMyStore(({
            ...myStore,
            [key]: rawValue,
        }))
        setFormattedPrice(comma(rawValue));
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
                setMyStore((prev) => ({
                    ...prev,
                    storeAddress: {
                        ...prev.storeAddress,
                        zoneCode: data.zonecode,
                        bcode: data.bcode,
                        jibunAddress: data.jibunAddress,
                        roadAddress: data.roadAddress,
                    }
                }));
            },
        }).open();
    };

    const handleSubmit = async (field) => {
        const handlers = {
            name: async () => await patchStoreName(myStore.id, { name: myStore[field]} ),
            minimumPrice: async () => patchMinPrice(myStore.id, { price: myStore[field]} ),
            phone: async () => await patchStorePhone(myStore.id, { phone: myStore[field]} ),
            address: async () => await patchStoreAddress(myStore.id, {
                zoneCode: myStore.storeAddress.zoneCode,
                bcode: myStore.storeAddress.bcode,
                jibunAddress: myStore.storeAddress.jibunAddress,
                roadAddress: myStore.storeAddress.roadAddress,
                detail: myStore.storeAddress.detail,
            }),
            categories: async () => await patchStoreCategories(myStore.id, { categoryIds: seletedCategories }),
        };

        try {
            if (!handlers[field]) {
                console.warn(`처리할 수 없는 필드: ${field}`);
                return;
            }

            const response = await handlers[field]();

            if (response.status === 'OK') {
                console.log(response.data);
                setMyStore(response.data);
            }
        } catch (e) {
            console.error(`${field} Request Failed:`, e);
        }
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [storeRes, categoriesRes] = await Promise.all([
                    getMyStore(),
                    getCategories()
                ]);

                if (!storeRes || !storeRes.data) {
                    console.error("⚠ storeRes 데이터 없음", storeRes);
                    setMyStore(null); // ✅ myStore를 안전하게 초기화
                    return;
                }

                setMyStore(storeRes.data);
                console.log(storeRes.data);

                if (storeRes.data.categories) {
                    setSeletedCategories(
                        Array.isArray(storeRes.data.categories)
                            ? storeRes.data.categories.map(category => category.categoryId)
                            : []
                    );
                }

                setFormattedPrice(comma(storeRes.data.minimumPrice));

                if (categoriesRes && categoriesRes.data) {
                    const formattedCategories = categoriesRes.data.content.map((category) => ({
                        label: category.name,
                        value: category.categoryId
                    }));
                    setCategories(formattedCategories);
                }
            } catch (error) {
                console.error("🚨 데이터 로드 실패:", error);
                setMyStore(null); // ✅ API 호출 실패 시 myStore를 null로 설정
            }
        };


        fetchData();
        loadDaumPostcodeScript();
    }, []);


    return (
        <div className="container-sm px-4 d-flex justify-content-center">
            <style>
                {`
                    .accordion-button {
                        background-color: #6E9FED;
                        color: black;
                    }
                `}
            </style>
            {myStore ? (
                <div className="accordion w-75" id="accordionExample">
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#collapseName" aria-expanded="true" aria-controls="collapseOne">
                                <h4>가게 기본 정보</h4>
                            </button>
                        </h2>
                        <div id="collapseName" className="accordion-collapse collapse show">
                            <div className="accordion-body">
                                <BtnInput
                                    id="name"
                                    label="가게 이름"
                                    placeholder="가게 이름을 입력하세요"
                                    type="text"
                                    value={myStore.name || ""}
                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                    onButtonClick={() => handleSubmit("name")}
                                />
                                <BtnInput
                                    id="minimumPrice"
                                    label="최소 주문 금액"
                                    placeholder="최소 주문 금액을 입력하세요"
                                    type="text"
                                    value={formattedPrice}
                                    onChange={(e) => handleCommaChange("minimumPrice", e.target.value)}
                                    onButtonClick={() => handleSubmit("minimumPrice")}
                                />
                                <BtnInput
                                    id="phone"
                                    label="전화 번호"
                                    placeholder="전화 번호를 입력해주세요"
                                    type="text"
                                    value={myStore.phone || ""}
                                    onChange={(e) => handleInputChange("phone", e.target.value)}
                                    onButtonClick={() => handleSubmit("phone")}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                        data-bs-target="#collapseAddress" aria-expanded="false" aria-controls="collapseTwo">
                                <h4>가게 주소</h4>
                            </button>
                        </h2>
                        <div id="collapseAddress" className="accordion-collapse collapse">
                            <div className="accordion-body">
                                <div className="row justify-content-center">
                                    <div className="col-md-7 card p-3">
                                        <button
                                            className="btn btn-success my-2 w-100"
                                            onClick={openDaumPostcode}
                                        >
                                            주소 검색
                                        </button>
                                        <Input
                                            type="text"
                                            id="jibunAddress"
                                            label="지번 주소"
                                            placeholder="주소를 검색해주세요."
                                            value={myStore.storeAddress.jibunAddress}
                                            readOnly={true}
                                        />
                                        <Input
                                            type="text"
                                            id="roadAddress"
                                            label="도로명 주소"
                                            placeholder="주소를 검색해주세요."
                                            value={myStore.storeAddress.roadAddress}
                                            readOnly={true}
                                        />
                                        <Input
                                            label="상세 주소"
                                            id="detail"
                                            type="text"
                                            placeholder="상세 주소를 입력해주세요."
                                            value={myStore.storeAddress.detail}
                                            onChange={(e) => handleAddressChange("detail", e.target.value)}
                                        />
                                        <button
                                            className="btn btn-primary w-100"
                                            onClick={() => handleSubmit("address")}
                                        >
                                            주소 수정
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#collapseCategories" aria-expanded="false" aria-controls="collapseThree">
                                <h4>가게 카테고리</h4>
                            </button>
                        </h2>
                        <div id="collapseCategories" className="accordion-collapse collapse">
                            <div className="accordion-body">
                                <CheckBox
                                    options={categories}
                                    min={1}
                                    max={4}
                                    selected={seletedCategories}
                                    onChange={setSeletedCategories}
                                />
                                <button
                                    className="btn btn-primary my-2 w-100"
                                    onClick={() => handleSubmit("categories")}
                                >
                                    카테고리 수정
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="row w-100 d-flex justify-content-center align-items-center">
                    <div className="col-md-6 container card m-5 p-5 d-flex justify-content-center align-items-center">
                        <h1 className="text-secondary">가게가 존재하지 않습니다.</h1>
                    </div>
                </div>
            )}

        </div>
    )
}