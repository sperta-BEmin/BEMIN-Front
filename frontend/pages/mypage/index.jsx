import React, { useState, useEffect } from "react";
import Input from "../../components/Input";
import {getMyInfo, updateMyInfo} from "../../utils/userApi";
import {setUserNickname} from "../../utils/localUser";

export default function MyPage() {
    const [formData, setFormData] = useState({
        password: "",
        nickname: "",
        phone: "",
        address: "",
    });

    const handleChange = (key, value) => {
        setFormData({
            ...formData,
            [key]: value,
        });
    };

    const fetchMyData = async () => {
        try {
            let res = await getMyInfo();
            if (res) {
                console.log(res);
                const userData= res.data;
                setFormData({
                    password: "",
                    nickname: userData.nickname,
                    phone: userData.phone,
                    address: userData.address,
                })
            }
        } catch (e) {
            console.log("유저 데이터 로드 실패", e);
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
                setFormData({
                    ...formData,
                    address: data.address, // 검색된 주소를 address 필드에 업데이트
                });
            },
        }).open();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let res = await updateMyInfo(formData);
            if (res) {
                console.log(res);
                const userData= res.data;
                setFormData({
                    password: "",
                    nickname: userData.nickname,
                    phone: userData.phone,
                    address: userData.address,
                })
                setUserNickname(userData.nickname);
            }
        } catch (e) {
            console.log("유저 데이터 업데이트 실패", e);
        }
    };

    useEffect(() => {
        // 컴포넌트 마운트 시 스크립트 로드
        loadDaumPostcodeScript();
        fetchMyData();
    }, []);


    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-4 card p-3">
                    <form onSubmit={handleSubmit}>
                        <Input
                            id="password"
                            label="비밀번호"
                            placeholder="비밀번호를 입력하세요"
                            type="password"
                            onChange={(e) => handleChange("password", e.target.value)}
                            value={formData.password}
                        />
                        <Input
                            id="nickname"
                            label="사용자 닉네임"
                            placeholder="닉네임을 입력하세요"
                            type="text"
                            onChange={(e) => handleChange("nickname", e.target.value)}
                            value={formData.nickname}
                        />
                        <Input
                            id="phone"
                            label="전화번호"
                            placeholder="전화번호를 입력하세요"
                            type="tel"
                            onChange={(e) => handleChange("phone", e.target.value)}
                            value={formData.phone}
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
                            회원정보 수정
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}