import React, {useState} from 'react';
import Input from "../../components/Input";
import {loginUser} from "../../utils/userApi";
import {router} from "next/client";
import {setUser} from "../../utils/localUser";

export default function Login() {
    const [formData, setFormData] = useState({
        userEmail: "",
        password: "",
    });

    const handleChange = (key, value) => {
        setFormData({
            ...formData,
            [key]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await loginUser(formData);
        console.log(response);

        if (response.error) {
            console.log(response.error);
        } else {
            console.log(response);
            // 임시 데이터 세팅
            setUser(response.data);
            await router.push("/");
        }
    }


    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-4">
                    <div className="card">
                        <img
                            src="/assets/logos/bemin_logo.png"
                            alt="bemin_logos" width="80"
                            className="card-img-top"
                        />
                        <div className="card-body">
                            <h3 className="text-center">로그인</h3>
                            <form onSubmit={handleSubmit}>
                                <Input
                                    id="userEmail"
                                    label="이메일"
                                    placeholder="이메일을 입력하세요"
                                    type="email"
                                    onChange={(e) => handleChange("userEmail", e.target.value)}
                                />
                                <Input
                                    id="password"
                                    label="비밀번호"
                                    placeholder="비밀번호를 입력하세요"
                                    type="password"
                                    onChange={(e) => handleChange("password", e.target.value)}
                                />
                                <button type="submit" className="btn btn-primary w-100">
                                    로그인
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}