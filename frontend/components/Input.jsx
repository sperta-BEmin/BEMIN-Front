import React from "react";

export default function Input({ id, label, placeholder, onChange, type, value, readOnly = false }) {
    return (
        <div className="mb-3">
            <label htmlFor={id} className="form-label">{label}</label>
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
    );
}
