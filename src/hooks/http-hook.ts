import { useCallback, useState } from "react";

interface IHttpClientForm {
    url: string;
    method: string;
    body: any;
    headers: {};
}
export const useHttpClient = () => {
    const [isLoading, setIsLoaging] = useState(false);
    const [error, setError] = useState(null);

    const sendRequest = useCallback(
        async (url: string, method = "GET", body = null, headers = {}) => {
            setIsLoaging(true);
            try {
                const response = await fetch(url, {
                    method,
                    body,
                    headers,
                });

                const responseData = await response.json();

                if (!response.ok) {
                    throw new Error(responseData.message);
                }

                return responseData;
            } catch (err: any) {
                setError(err.message);
            }
            setIsLoaging(false);
        },
        []
    );

    const clearError = () => {
        setError(null);
    };
    return { isLoading, error, sendRequest, clearError };
};
