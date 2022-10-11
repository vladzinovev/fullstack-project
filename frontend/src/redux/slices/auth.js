import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchAuth=createAsyncThunk('auth/fetchUserData',async (params) =>{
    const {data} = await axios.post('/auth/login', params);
    return data;
})

const initialState={
    items:null,
    status:'loading'
}

const authSlice=createSlice({
    name:'auth',
    initialState,
    reducers:{
        //создаем выход из аккаунта
        logout:(state)=>{
            state.data=null;
        }
    },
    extraReducers:{
        [fetchAuth.pending]:(state)=>{
            state.status='loading';
            state.data=null;
        },
        [fetchAuth.fulfilled]:(state,action)=>{
            state.status='loaded';
            state.data=action.payload;
        },
        [fetchAuth.rejected]:(state)=>{
            state.status='error';
            state.data=null;
        },
    }
})

// булевое значение об авторизации
export const selectIsAuth=(state)=>Boolean(state.auth.data);

export const authReducer=authSlice.reducer;

export const {logout}=authSlice.actions;