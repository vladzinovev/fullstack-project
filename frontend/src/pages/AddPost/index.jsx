import React from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
//библиотека для формы блока создание статьи
import SimpleMDE from 'react-simplemde-editor';
import {Navigate, useNavigate, useParams} from "react-router-dom";

import axios from '../../axios';

import { useDispatch , useSelector} from "react-redux";

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import { selectIsAuth } from '../../redux/slices/auth';

export const AddPost = () => {
  const {id}=useParams();
  const navigate=useNavigate();
  const isAuth=useSelector(selectIsAuth);
  const [isLoading, setIsLoading] = React.useState(false);
  const [text, setText] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [tags, setTags] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('');
  const inputFileRef=React.useRef(null);

  const isEditing=Boolean(id);

  const handleChangeFile =async (event) => {
    try{
      const formData=new FormData();
      const file =event.target.files[0];
      formData.append('image', file );
      const {data}=await axios.post('/upload', formData);
      setImageUrl(data.url);
    } catch(err){
      console.warn(err);
      alert('Ошибка при загрузке файла!');
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl('');
  };

  const onChange = React.useCallback((value) => {
    setValue(value);
  }, []);

  const onSubmit=async ()=>{
    try{
      setIsLoading(true);

      const fields={
        title,
        imageUrl,
        tags,
        text
      };
      
      const {data} = isEditing
      ?await axios.patch(`/posts/${id}`,fields)
      :await axios.post('/posts',fields);

      const _id=isEditing?id:data._id;
      navigate(`/posts/${_id}`)
    } catch (err){
      console.warn(err);
      alert('Ошибка при создании статьи!');
    }
  }

  //если мы не авторизовнаы, то переходим на главную
  if (!window.localStorage.getItem('token') && !isAuth){
    return <Navigate to='/'/>
  }

  React.useEffect(()=>{
    if(id){
      axios.get(`/posts/${id}`).then((data)=>{
        setTitle(data.title);
        setText(data.text);
        setImageUrl(data.imageUrl);
        setTags(data.tags.join(','));
      }).catch(err=>{
        console.warn(err);
        alert('Ошибка при получении статьи!');
      })
    }
  },[])

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );

  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={()=>inputFileRef.current.click()} variant="outlined" size="large">
        Загрузить превью
      </Button>
      <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
      {imageUrl && (
        <>
          <Button variant="contained" color="error" onClick={onClickRemoveImage}>
            Удалить
          </Button>
          <img className={styles.image} src={`http://localhost:4444${imageUrl}`} alt="Uploaded" />
        </>
      )}
      
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        value={title}
        onChange={e=>setTitle(e.target.value)}
        fullWidth
      />
      <TextField 
        value={tags}
        onChange={e=>setTags(e.target.value)}
        classes={{ root: styles.tags }} 
        variant="standard" 
        placeholder="Тэги" 
        fullWidth />
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
      <div className={styles.buttons}>
        <Button onClock={onSubmit} size="large" variant="contained">
          {isEditing?'Сохранить':'Опубликовать'}
        </Button>
        <a href="/">
          <Button size="large">Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};
