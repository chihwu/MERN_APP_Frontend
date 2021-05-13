import { useState, useCallback, useRef, useEffect } from 'react';

export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
 
    const activeHttpRequests = useRef([]); // this will store data across re-render cycle

    // useCallback() is used so that sendRequest() function won't be re-created when the component uses this hook re-renders.
    const sendRequest = useCallback(async (url, method = 'GET', body = null, headers = {}) => {

        setIsLoading(true);
        const httpAbortCtrll = new AbortController();  // the AbortController is used so that any lingering request between any rendering cycle will be cleared.
        activeHttpRequests.current.push(httpAbortCtrll);

        try {
            const response = await fetch(url, {
                method,
                body,
                headers,
                signal: httpAbortCtrll.signal    // this associates the signal and controller with the fetch request and allows us to abort it by calling AbortController.abort()
                                                 // When abort() is called, the fetch() promist rejects with an AbortError
            });

            const responseData = await response.json();

            // clean the just-finished request controller so we don't keep old request controller
            activeHttpRequests.current = activeHttpRequests.current.filter(
                reqCtrl => reqCtrl !== httpAbortCtrll
            );

            if (!response.ok) {
                throw new Error(responseData.message);
            }

            setIsLoading(false);
            return responseData;
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
            throw err;
        }

    }, []);

    const clearError = () => {
        setError(null);
    }; 

    useEffect(() => {
        return () => {
            activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
        }; // for clean-up purpose before each render
    }, []);

    return { isLoading, error, sendRequest, clearError };
};