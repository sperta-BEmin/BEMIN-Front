/**
 * 빈값 체크 ver2 > 기존 동등연산자(==)가 아닌 일치연산자(===)로 빈값을 더 엄격하게 체크하는 버전
 * @param text
 * @param rText
 * @returns {string}
 */
export function g_nvl2(text, rText) {
    if (text === null || text === undefined) text = "";
    if (rText !== null && rText !== undefined && text === "") text = rText;
    return text;
}

/**
 * 콤마찍기
 * 2023-03-12 : uc 가 없더라도 comma 를 모두 지운 후 실행한다.
 */
export function comma(str) {
    str = String(Number(String(g_nvl2(str, "0")).replace(/[^0-9-]/g,"")));
    return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, "$1,");

    // str = String(g_nvl2(str, "0"));
    // return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, "$1,");
}