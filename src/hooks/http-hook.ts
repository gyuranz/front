import { useCallback, useState } from "react";
import { useRecoilState } from "recoil";
import { AuthLogin } from "../atoms";

export const useHttpClient = () => {
    const [isLoading, setIsLoaging] = useState(false);
    const [error, setError] = useState("");
    const [userState, setUserState] = useRecoilState(AuthLogin);

    const sendRequest = useCallback(
        async (url: string, method: string, body: any, headers = {}) => {
            try {
                setIsLoaging(true);
                const response = await fetch(url, {
                    method,
                    body,
                    headers,
                });

                const responseData = await response.json();

                setIsLoaging(false);
                if (!response.ok) {
                    throw new Error(responseData.message);
                }
                setUserState({
                    ...userState,
                    isLoggedIn: true,
                    userId: responseData.userId,
                    userNickname: responseData.userNickname,
                    token: responseData.token,
                });

                localStorage.setItem(
                    "userData",
                    JSON.stringify({
                        userId: responseData.userId,
                        userNickname: responseData.userNickname,
                        token: responseData.token,
                    })
                );

                return JSON.stringify(responseData);
            } catch (err: any) {
                setError(err.message);
                setIsLoaging(false);
            }
        },
        []
    );

    const clearError = () => {
        setError("");
    };
    return { isLoading, error, sendRequest, clearError };
};
