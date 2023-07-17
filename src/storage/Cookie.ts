import { Cookies } from "react-cookie";

const cookies = new Cookies();
// refresh 토큰을 쿠키에 저장하기 위한 함수
export const setRefreshToken = (refreshToken: any) => {
    const today = new Date();
    const expireDate = today.setDate(today.getDate() + 3);

    return cookies.set("refresh_token", refreshToken, {
        sameSite: "strict",
        path: "/",
        expires: new Date(expireDate),
    });
};
// 쿠키에 저장된 refresh 토큰 값을 가져오기 위한 함수
export const getCookieToken = () => {
    return cookies.get("refresh_token");
};
// logout 시 사용
export const removeCookieToken = () => {
    return cookies.remove("refresh_token", { sameSite: "strict", path: "/" });
};
