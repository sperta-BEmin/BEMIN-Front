import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useEffect} from "react";
import Layout from '../components/Layout';
import {AuthProvider} from "../context/AuthContext";

export default function MyApp({ Component, pageProps }) {
    useEffect(() => {
        if (typeof window !== "undefined") {
            import("bootstrap/dist/js/bootstrap.bundle.min")
                .then(() => console.log("Bootstrap JS Loaded"))
                .catch((err) => console.error("Bootstrap JS Load Error:", err));
        }
        // 모달을 랜더링할 DOM 요소가 없으면 생성
        if (!document.getElementById("modal-root")) {
            const modalRoot = document.createElement("div");
            modalRoot.id = "modal-root";
            document.body.appendChild(modalRoot);
        }
    }, []);
    return (
        <AuthProvider>
            <Layout>
                <Component {...pageProps} />
                {/* 모달이 랜더링 될 위치 */}
                <div id="modal-root"></div>
            </Layout>
        </AuthProvider>
    )
}
