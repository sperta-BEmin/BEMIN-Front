import React from 'react';
import ReactDOM from 'react-dom';

export default function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    {/* 🔹 모달 헤더 */}
                    <div className="modal-header">
                        <h5 className="modal-title">{title || "Modal Title"}</h5>
                        <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
                    </div>

                    {/* 🔹 모달 바디 (동적 컨텐츠 렌더링) */}
                    <div className="modal-body">
                        {children || <p>Modal body text goes here.</p>}
                    </div>

                    {/* 🔹 모달 푸터 */}
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
                        <button type="button" className="btn btn-primary">Save changes</button>
                    </div>
                </div>
            </div>
        </div>,
        document.getElementById("modal-root") // 모달을 #modal-root에 렌더링
    );
}
