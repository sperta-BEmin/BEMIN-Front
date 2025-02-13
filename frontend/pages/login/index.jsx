import React, {useState} from 'react';
import Input from "../../components/Input";

export default function Login() {
    const [formData, setFormData] = useState({
        userId: "",
        password: "",
    });

    const handleChange = (key, value) => {
        setFormData({
            ...formData,
            [key]: value,
        });
    };


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
                            <form>
                                <Input
                                    id="userId"
                                    label="아이디"
                                    placeholder="아이디를 입력하세요"
                                    type="text"
                                    onChange={(e) => handleChange("userId", e.target.value)}
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