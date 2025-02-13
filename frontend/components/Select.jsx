import React from 'react';

export default function Select({ id, label, defaultValue, options, onChange }) {
    return (
        <div className="mb-3">
            <label htmlFor={id} className="form-label">{label}</label>
            <select
                id={id}
                className="form-select form-select-lg"
                aria-label="Large select example"
                defaultValue={defaultValue}
            >
                <option value="" disabled>
                    {label}
                </option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}