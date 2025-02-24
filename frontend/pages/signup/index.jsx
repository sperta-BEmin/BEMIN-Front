import React, { useState, useEffect } from "react";
import Input from "../../components/Input";
import {checkEmailExists, signupUser} from "../../utils/userApi";
import {router} from "next/client";

export default function SignUp() {
    const [formData, setFormData] = useState({
        userEmail: "",
        password: "",
        name: "",
        nickname: "",
        phone: "",
        address: {
            bcode: "",
            jibunAddress: "",
            roadAddress: "",
            detail: ""
        },
        role:"CUSTOMER",
    });

    const handleChange = (key, value) => {
        setFormData({
            ...formData,
            [key]: value,
        });
    };

    const handleAddressChange = (key, value) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            address: {
                ...prevFormData.address,
                [key]: value,
            }
        }));
    }

    const validateEmail = () => {
        checkEmailExists(formData.userEmail).then(r => console.log(r));
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
                        address: {
                        ...prevFormData.address,
                            jibunAddress: data.jibunAddress,
                            roadAddress: data.roadAddress,
                            bcode: data.bcode,
                        }
                }));
            },
        }).open();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await signupUser(formData);
        console.log(response);

        if (response.error) {
            console.log(response.error);
        } else {
            await router.push("/login");
        }
    };

    useEffect(() => {
        // 컴포넌트 마운트 시 스크립트 로드
        loadDaumPostcodeScript();
    }, []);


    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-4 card p-3">
                    <form onSubmit={handleSubmit}>
                        <Input
                            id="userEmail"
                            label="이메일"
                            placeholder="이메일을 입력하세요"
                            type="email"
                            onChange={(e) => handleChange("userEmail", e.target.value)}
                        />
                        <button
                            type="button"
                            className="btn btn-primary w-100"
                            onClick={validateEmail}
                        >
                            이메일 중복 검사
                        </button>
                        <Input
                            id="password"
                            label="비밀번호"
                            placeholder="비밀번호를 입력하세요"
                            type="password"
                            onChange={(e) => handleChange("password", e.target.value)}
                        />
                        <Input
                            id="name"
                            label="이름"
                            placeholder="이름을 입력하세요"
                            type="text"
                            onChange={(e) => handleChange("name", e.target.value)}
                        />
                        <Input
                            id="nickname"
                            label="사용자 닉네임"
                            placeholder="닉네임을 입력하세요"
                            type="text"
                            onChange={(e) => handleChange("nickname", e.target.value)}
                        />
                        <Input
                            id="phone"
                            label="전화번호"
                            placeholder="전화번호를 입력하세요"
                            type="tel"
                            onChange={(e) => handleChange("phone", e.target.value)}
                        />
                        <div className="mb-3">
                            <button
                                type="button"
                                className="btn btn-secondary mt-2 w-100"
                                onClick={openDaumPostcode}
                            >
                                주소 검색
                            </button>
                            <Input
                                type="text"
                                id="jibunAddress"
                                label="지번 주소"
                                placeholder="주소를 검색해주세요."
                                value={formData.address.jibunAddress}
                                readOnly={true}
                            />
                            <Input
                                label="도로명 주소"
                                id="roadAddress"
                                type="text"
                                placeholder="주소를 검색해주세요."
                                value={formData.address.roadAddress}
                                readOnly={true}
                            />
                            <Input
                                label="상세 주소"
                                id="detail"
                                type="text"
                                placeholder="상세 주소를 입력해주세요."
                                value={formData.address.detail}
                                onChange={(e) => handleAddressChange("detail", e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn btn-success mt-3">
                            회원가입
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}