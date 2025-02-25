import {getRefreshTokenFromCookie, getUserToken} from "./localUser";

async function apiRequest(method, path, params = {}, body = null) {
    // path가 슬래시('/')로 끝나는 경우 제거
    path = path.replace(/\/$/, "");

    const queryString = new URLSearchParams(params).toString();
    const url = `/api/proxy?path=${path}${queryString ? `&${queryString}` : ""}`;

    const token = getUserToken();
    const refreshToken = getRefreshTokenFromCookie();

    const headers = {"Content-Type": "application/json"};

    console.log(token);

    if (token) {
        headers.Authorization = token;
    }

    if (refreshToken) {
        headers["refresh"] = refreshToken; // 🔹 refresh 토큰을 헤더에 추가
    }

    if (method !== "GET") {
        headers["Content-Type"] = "application/json";
    }

    try {
        const response = await fetch(url, {
            method,
            headers,
            body: method === "GET" ? null : JSON.stringify(body),
            credentials: "include",
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
const checkEmailExists = (email) => apiRequest("GET", "auth/email/exists", { email });
const signupUser = async (userData) => apiRequest("POST", "auth/signup", {}, userData);
const loginUser = async (userData) => apiRequest("POST", "auth/signin", {}, userData);
const getMyInfo = async () => apiRequest("GET", "users/my-info", {}, {});
const updateMyInfo = async (userData) => apiRequest("PUT", "users/my-info", {}, userData);

// order API 요청 함수들
const createOrder = async (orderData) => apiRequest("POST", "orders/order", {}, orderData);
const readOrder = async (params) => apiRequest("GET", "orders/check", params);
const getOrderDetailsByOrderId = async (orderId) => apiRequest("GET", "orders/detail/", { orderId });

// category API 요청 함수들
const createCategory = async (categoryData) => apiRequest("POST", "v1/admin/categories", {}, categoryData);
const getCategories = async () => apiRequest("GET", "v1/categories");

// store API 요청 함수들
const getMyStore = async () => apiRequest("GET", "v1/admin/stores/by-user");
const createStore = async (formData) => apiRequest("POST", "v1/admin/stores", {}, formData);
const patchStoreName = async (storeId, data) => apiRequest("PATCH", `v1/admin/stores/${storeId}/name`, {}, data);
const patchMinPrice = async (storeId, data) => apiRequest("PATCH", `v1/admin/stores/${storeId}/minimum-price`, {}, data);
const patchStorePhone = async (storeId, data) => apiRequest("PATCH", `v1/admin/stores/${storeId}/phone`, {}, data);
const patchStoreAddress = async (storeId, data) => apiRequest("PATCH", `v1/admin/stores/${storeId}/address`, {}, data);
const patchStoreCategories = async (storeId, data) => apiRequest("PATCH", `v1/admin/stores/${storeId}/categories`, {}, data);
const searchStore = async (param) => apiRequest("GET", "v1/stores/search", param)

const getOneStore = async (storeId) => apiRequest("GET", `v1/stores/${storeId}`);

// product API 요청 함수들
const createProduct = async (storeId, data) => apiRequest("POST", `product/${storeId}/products`, {}, data);
const getProducts = async (storeId, params) => apiRequest("GET", `product/${storeId}/products`, params);

// pay API 함수들
const createPay = async(data) => apiRequest("POST", "payments", {}, data);
const getPay = async(id) => apiRequest("GET", "payments/status");

module.exports = {
    checkEmailExists,
    signupUser,
    loginUser,
    getMyInfo,
    updateMyInfo,
    createOrder,
    readOrder,
    getOrderDetailsByOrderId,
    createCategory,
    getCategories,
    getMyStore,
    createStore,
    patchStoreName,
    patchMinPrice,
    patchStoreAddress,
    patchStoreCategories,
    patchStorePhone,
    searchStore,
    getOneStore,
    createProduct,
    getProducts,
    createPay,
    getPay,
}