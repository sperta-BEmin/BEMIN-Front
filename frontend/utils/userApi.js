import {getUserToken} from "./localUser";

async function apiRequest(method, path, params = {}, body = null) {
    // path가 슬래시('/')로 끝나는 경우 제거
    path = path.replace(/\/$/, "");

    const queryString = new URLSearchParams(params).toString();
    const url = `/api/proxy?path=${path}${queryString ? `&${queryString}` : ""}`;

    const token = getUserToken();

    const headers = {"Content-Type": "application/json"};

    if (token) {
        headers.Authorization = token;
    }

    if (method !== "GET") {
        headers["Content-Type"] = "application/json";
    }

    try {
        const response = await fetch(url, {
            method,
            headers,
            body: method === "GET" ? null : JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`서버 오류: ${response.status}, 메시지: ${errorData.message || "알 수 없는 오류"}`);
        }

        return await response.json();
    } catch (error) {
        return { error: error.message };
    }
}

//user API 요청 함수들
export const checkEmailExists = (email) => apiRequest("GET", "auth/email/exists", { email });
export const signupUser = async (userData) => apiRequest("POST", "auth/signup", {}, userData);
export const loginUser = async (userData) => apiRequest("POST", "auth/signin", {}, userData);
export const getMyInfo = async () => apiRequest("GET", "users/my-info", {}, {});
export const updateMyInfo = async (userData) => apiRequest("PUT", "users/my-info", {}, userData);

// order API 요청 함수들
export const createOrder = async (orderData) => apiRequest("POST", "orders/order", {}, orderData);
export const readOrder = async (params) => apiRequest("GET", "orders/check", params);
export const getOrderDetailsByOrderId = async (orderId) => apiRequest("GET", "orders/detail/", { orderId });

// category API 요청 함수들
export const createCategory = async (categoryData) => apiRequest("POST", "v1/admin/categories", {}, categoryData);
export const getCategories = async () => apiRequest("GET", "v1/categories");