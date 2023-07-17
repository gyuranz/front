import { atom, selector } from "recoil";

// milisecond
export const TOKEN_TIME_OUT = 600 * 1000;

export const authTokenState = atom({
    key: "authToken",
    default: {
        authenticated: false,
        accessToken: null,
        exprieTime: null,
    },
});

export const setToken = (state: any, payload: any) => {
    return {
        ...state,
        authenticated: true,
        accessToken: payload,
        expireTime: new Date().getTime() + TOKEN_TIME_OUT,
    };
};

export const deleteToken = (state: any) => {
    return {
        ...state,
        authenticated: false,
        accessToken: null,
        expireTime: null,
    };
};
