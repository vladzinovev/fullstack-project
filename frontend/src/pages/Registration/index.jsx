import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { useDispatch , useSelector} from "react-redux";
import {useForm} from 'react-hook-form';
import {fetchAuth, selectIsAuth, fetchRegister} from '../../redux/slices/auth';
import styles from './Login.module.scss';

export const Registration = () => {
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();
  const {
    register, 
    handleSubmit, 
    setError, 
    fromState:{errors,isValid},
  }=useForm({
    defaultValues:{
      fullName:'',
      email:'',
      password:'',
    },
    //валидация будет происходить если эти два поля поменялись
    mode:'onChange'
  });

  const onSubmit=async (values)=>{
    const data = await dispatch(fetchRegister(values));
    if (!data.payload){
      return alert('Не удалось зарегистрироваться!')
    }
    //сохраняем наши данные в локалсторадж, чтобы не вылетал аккаунт
    if ('token' in data.payload){
      window.localStorage.setItems('token',data.payload.token);
    } 
    
  };

  //если мы авторизовнаы, то переходим на главную
  if (isAuth){
    return <Navigate to='/'/>
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Создание аккаунта
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField 
          //будет подсвечиваться красным
          error={Boolean(errors.fullName?.message)}
          helperText={errors.fullName?.message}
          {...register('fullName',{required:'Укажите полное имя'})}
          className={styles.field} 
          label="Полное имя" 
          fullWidth 
        />
        <TextField 
          //будет подсвечиваться красным
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          //чтобы браузер подсказывал что надо email@.ru ввести
          type="email"
          {...register('email',{required:'Укажите почту'})}
          className={styles.field} 
          label="E-Mail" 
          fullWidth 
        />
        <TextField 
          //будет подсвечиваться красным
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          //чтобы браузер подсказывал что надо email@.ru ввести
          type="password"
          {...register('password',{required:'Введите пароль'})}
          className={styles.field} 
          label="Пароль" 
          fullWidth 
        />
        <Button disabled={!isValid} type='submit' size="large" variant="contained" fullWidth>
          Зарегистрироваться
        </Button>
      </form>
    </Paper>
  );
};
