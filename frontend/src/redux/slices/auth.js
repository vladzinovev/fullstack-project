import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchAuth=createAsyncThunk('auth/fetchAuth',async (params) =>{
    const {data} = await axios.post('/auth/login', params);
    return data;
})

export const fetchAuthMe=createAsyncThunk('auth/fetchAuthMe',async () =>{
    const {data} = await axios.post('/auth/me');
    return data;
})

export const fetchRegister=createAsyncThunk('auth/fetchRegister',async () =>{
    const {data} = await axios.post('/auth/register');
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

        [fetchAuthMe.pending]:(state)=>{
            state.status='loading';
            state.data=null;
        },
        [fetchAuthMe.fulfilled]:(state,action)=>{
            state.status='loaded';
            state.data=action.payload;
        },
        [fetchAuthMe.rejected]:(state)=>{
            state.status='error';
            state.data=null;
        },

        [fetchRegister.pending]:(state)=>{
            state.status='loading';
            state.data=null;
        },
        [fetchRegister.fulfilled]:(state,action)=>{
            state.status='loaded';
            state.data=action.payload;
        },
        [fetchRegister.rejected]:(state)=>{
            state.status='error';
            state.data=null;
        },
    }
})

// булевое значение об авторизации
export const selectIsAuth=(state)=>Boolean(state.auth.data);

export const authReducer=authSlice.reducer;

export const {logout}=authSlice.actions;