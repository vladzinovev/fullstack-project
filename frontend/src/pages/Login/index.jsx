import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import {useForm} from 'react-hook-form';
import { useDispatch , useSelector} from "react-redux";
import {Navigate} from "react-router-dom";
import {fetchAuth, selectIsAuth} from '../../redux/slices/auth';

import styles from "./Login.module.scss";

export const Login = () => {
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();
  const {
    register, 
    handleSubmit, 
    setError, 
    fromState:{errors,isValid},
  }=useForm({
    defaultValues:{
      email:'',
      password:'',
    },
    //валидация будет происходить если эти два поля поменялись
    mode:'onChange'
  });


  const onSubmit=(values)=>{
    dispatch(fetchAuth(values))
  };

  //если мы авторизовнаы, то переходим на главную
  if (isAuth){
    return <Navigate to='/'/>
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Вход в аккаунт
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label="E-Mail"
          //будет подсвечиваться красным
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          //чтобы браузер подсказывал что надо email@.ru ввести
          type="email"
          {...register('email',{required:'Укажите почту'})}
          fullWidth
        />
        <TextField 
          className={styles.field} 
          label="Пароль" 
          //будет подсвечиваться красным
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register('password',{required:'ВВедите пароль'})}
          fullWidth 
        />
        <Button type='submit' size="large" variant="contained" fullWidth>
          Войти
        </Button>
      </form>
    </Paper>
  );
};
