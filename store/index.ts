import { configureStore } from '@reduxjs/toolkit';
import counter from './counter';
import fetchData from './fetchData';
import login from './login';


const store = configureStore({
    reducer: {
        counter: counter,
        login: login,
        fetchData: fetchData

    }
  });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;