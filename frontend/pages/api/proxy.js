export default async function handler(req, res) {
    const { path, ...queryParams } = req.query;

    if (!path) {
        return res.status(400).json({ error: "API 경로가 제공되지 않았습니다." });
    }

    const backendUrl = `http://localhost:8080/api/${path}${Object.keys(queryParams).length ? "?" + new URLSearchParams(queryParams) : ""}`;

    try {
        const headers = { ...req.headers };

        const options = {
            method: req.method,
            headers,
            body: req.method === "GET" ? null : JSON.stringify(req.body),
        };

        console.log(headers);

        const response = await fetch(backendUrl, options);

        const setCookieHeader = response.headers.get("set-cookie");

        if (setCookieHeader) {
            res.setHeader("Set-Cookie", setCookieHeader);
        }

        const data = await response.json();

        res.status(response.status).json(data);
    } catch (error) {
        res.status(500).json({ error: "서버 요청 실패" });
    }
}
