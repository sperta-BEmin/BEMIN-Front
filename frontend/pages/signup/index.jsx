import React, { useState, useEffect } from "react";
import Input from "../../components/Input";

export default function SignUp() {
    const [formData, setFormData] = useState({
        userId: "",
        password: "",
        name: "",
        phone: "",
        email: "",
        address: "",
        nickname: "",
    });

    const handleChange = (key, value) => {
        setFormData({
            ...formData,
            [key]: value,
        });
    };

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
                setFormData({
                    ...formData,
                    address: data.address, // 검색된 주소를 address 필드에 업데이트
                });
            },
        }).open();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("회원가입 데이터:", formData);
        alert(
            `아이디: ${formData.userId}\n닉네임: ${formData.nickname}\n비밀번호: ${formData.password}\n이름: ${formData.name}\n전화번호: ${formData.phone}\n이메일: ${formData.email}\n주소: ${formData.address}`
        );
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
                            id="userId"
                            label="아이디"
                            placeholder="아이디를 입력하세요"
                            type="text"
                            onChange={(e) => handleChange("userId", e.target.value)}
                        />
                        <Input
                            id="nickname"
                            label="사용자 닉네임"
                            placeholder="닉네임을 입력하세요"
                            type="text"
                            onChange={(e) => handleChange("nickname", e.target.value)}
                        />
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
                            id="phone"
                            label="전화번호"
                            placeholder="전화번호를 입력하세요"
                            type="tel"
                            onChange={(e) => handleChange("phone", e.target.value)}
                        />
                        <Input
                            id="email"
                            label="이메일"
                            placeholder="이메일을 입력하세요"
                            type="email"
                            onChange={(e) => handleChange("email", e.target.value)}
                        />
                        <div className="mb-3">
                            <label htmlFor="address" className="form-label">주소</label>
                            <input
                                type="text"
                                id="address"
                                className="form-control form-control-lg"
                                placeholder="주소를 검색하세요"
                                value={formData.address}
                                readOnly
                            />
                            <button
                                type="button"
                                className="btn btn-secondary mt-2"
                                onClick={openDaumPostcode}
                            >
                                주소 검색
                            </button>
                        </div>
                        <button type="submit" className="btn btn-primary mt-3">
                            회원가입
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}