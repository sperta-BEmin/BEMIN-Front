async function apiRequest(method, path, params = {}, body = null) {
    const queryString = new URLSearchParams(params).toString();
    const url = `/api/proxy?path=${path}${queryString ? `&${queryString}` : ""}`;

    const token = localStorage.getItem("token");

    const headers = {"Content-Type": "application/json"};

    if (token) {
        headers.Authorization = token;
    }

    if (method !== "GET") {
        headers["Content-Type"] = "application/json"; // GET 요청에서는 Content-Type 제외
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

// order API 요청 함수들
export const createOrder = async (orderData) => apiRequest("POST", "orders/order", {}, orderData);