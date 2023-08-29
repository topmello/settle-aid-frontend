import { useEffect } from 'react';
import axios, { Method } from 'axios';
import { useDispatch } from 'react-redux';

import { fetchDataRequest, fetchDataSuccess, fetchDataFailure } from '../store/fetchData';


const useFetch = (endpoint: string, method: Method, body: object = {}, token: string | null) => {

    const dispatch = useDispatch();

    const options = {
        method: method,
        url: `http://34.129.1.154:8000/${endpoint}`,
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        data: body
    }

    const fetchData = async () => {
        
        dispatch(fetchDataRequest());

        try {
            
            const response = await axios(options);
            dispatch(fetchDataSuccess(response.data));
            
        } catch (error: any) {
            dispatch(fetchDataFailure({ message: error.message }));

        }
    };

    useEffect(() => {
        fetchData();
    }, [endpoint, token, JSON.stringify(body)]);

};

export default useFetch;