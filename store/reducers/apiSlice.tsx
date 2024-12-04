import {createSlice} from '@reduxjs/toolkit';
import {INITIATED, SUCCEEDED, ERRORED} from '@/genericApi/constants';

interface InitialState {
  api: {[key: string]: any};
}
const initialState: InitialState = {
  api: {}
};

const apiSlice = createSlice({
  name: 'api',
  initialState,
  reducers: {
    [INITIATED]: (state: InitialState, action: any) => {
      state.api[action.apiName] = {
        inprogress: 1,
        isError: false,
        errorMessage: '',
        errorCode: ''
      };
      console.log('apiInitiated');
    },
    [SUCCEEDED]: (state: InitialState, action: any) => {
      state.api[action.apiName] = {
        inprogress: 0,
        isError: false,
        errorMessage: '',
        errorCode: ''
      };
      console.log('apiSucceded');
    },
    [ERRORED]: (state: InitialState, action: any) => {
      state.api[action.apiName] = {
        inprogress: 0,
        ...action.response,
        isError: true
      };
      console.log('apiErrored');
    }
  }
});

const apiReducer = apiSlice.reducer;
export default apiReducer;
