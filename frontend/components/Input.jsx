import React from "react";

export default function Input({ id, label, placeholder, onChange, type, value, readOnly = false, className = "" }) {
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
            </div>
        </div>
    );
}
