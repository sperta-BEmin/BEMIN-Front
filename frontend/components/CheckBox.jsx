import React, { useState, useEffect } from "react";

export default function CheckBox({ options, min = 1, max = 1, selected = [], onChange }) {
    const [checkedItems, setCheckedItems] = useState(selected);

    // ✅ 부모에서 받은 `selected` 값이 변경되면 상태 반영
    useEffect(() => {
        setCheckedItems(selected);
    }, [selected]);

    // ✅ checkedItems가 변경될 때만 부모 상태 업데이트 (렌더링 중 호출 방지)
    useEffect(() => {
        if (checkedItems.length > 0) {
            onChange(checkedItems);
        }
    }, [checkedItems, onChange]);

    const handleCheckboxChange = (value) => {
        setCheckedItems((prevChecked) => {
            const isChecked = prevChecked.includes(value);
            let updatedChecked;

            if (isChecked) {
                if (prevChecked.length > min) {
                    updatedChecked = prevChecked.filter((item) => item !== value);
                } else {
                    return prevChecked;
                }
            } else {
                if (prevChecked.length < max) {
                    updatedChecked = [...prevChecked, value];
                } else {
                    return prevChecked;
                }
            }

            return updatedChecked; // ✅ 여기서 직접 onChange 호출하지 않음
        });
    };

    return (
        <div className="card p-3 mb-3">
            <h5 className="card-title">카테고리 선택</h5>
            <p className="text-muted">최소 {min}개, 최대 {max}개 선택 가능합니다.</p>

            <div className="row">
                {options.map((option) => (
                    <div key={option.value} className="col-md-6">
                        <div className="form-check">
                            <input
                                type="checkbox"
                                id={option.value}
                                className="form-check-input"
                                checked={checkedItems.includes(option.value)} // ✅ 체크 상태 반영
                                onChange={() => handleCheckboxChange(option.value)}
                            />
                            <label htmlFor={option.value} className="form-check-label">
                                {option.label}
                            </label>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-3 d-flex align-items-center justify-content-between">
                <span className="badge bg-primary">
                    선택된 개수: {checkedItems.length} / {max}
                </span>
                <button className="btn btn-outline-danger btn-sm" onClick={() => setCheckedItems([])}>
                    초기화
                </button>
            </div>
        </div>
    );
}
