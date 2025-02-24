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

/**
 * 콤마풀기
 * null_allowed_flag에 따라 return을 0 or ""로 함.
 * @param str
 * @param null_allowed_flag
 * @returns {string|number}
 */
export function uc(str, null_allowed_flag) {
    if(null_allowed_flag == true &&(str == "" || str == null)){
        return "";
    }else if((null_allowed_flag == false || null_allowed_flag == undefined) && (str == "" || str == null)){
        return 0;
    }

    // String 바꿔주는 이유: replace() -> number 일때 사용불가
    let replace_str = String(str);
    let minus_flag = "";
    if( replace_str.indexOf("-")>-1){
        minus_flag = "-";
    }
    return minus_flag + replace_str.replace(/[^\d]+/g, '');
    // return str.replace(/[^0-9-.]/g, '');
}

export function localDateTrans(localDate) {
    const date = new Date(localDate.split('.')[0]);

    const formattedDate = date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).replace(/. /g, '/').replace(/,/g, '');

    return formattedDate;
}