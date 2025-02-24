import React from "react";

export default function BtnInput({
     id,
     label,
     placeholder,
     onChange,
     type,
     value,
     readOnly = false,
     className = "",
     onButtonClick // 🔥 버튼 클릭 이벤트 추가
 }) {
    return (
        <div className={`mb-3 ${className}`}>
            <label htmlFor={id} className="form-label">{label}</label>
            <div className="input-group">
                <input
                    id={id}
                    className="form-control form-control-lg"
                    placeholder={placeholder}
                    onChange={onChange}
                    type={type}
                    value={value}
                    readOnly={readOnly}
                />
                <button
                    className="btn btn-primary"
                    type="button"
                    onClick={onButtonClick}
                >
                    제출
                </button>
            </div>
        </div>
    );
}
