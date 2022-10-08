import express from 'express';
import jwt from 'jsonwebtoken';
const app = express();
import mongoose from 'mongoose';
import { registerValidation, loginValidation, postCreateValidation} from './validations.js';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import UserModel from './models/User.js';
import { checkAuth } from './utils/index.js';
import * as UserController from './controllers/UserController.js';
import * as PostController from './controllers/PostController.js';

//подключаем БД
mongoose.connect('mongodb+srv://admin:adm123@cluster0.j7ewm4r.mongodb.net/?retryWrites=true&w=majority')
    .then(()=>console.log('connect to DB OK'))
    .catch((err)=>console.log('DB error', err))

//создаем storage где будем хранить наши картинки
const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage });

//запрос на загрузку картинки
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
      url: `/uploads/${req.file.originalname}`,
    });
  });

//научили читать json запросы
app.use(express.json())
//прлверяет если нужный файл в данной папке
app.use('/uploads', express.static('uploads'));

//если приходит get запрос отправляем привет мир (что передаем клиенту)
app.get('/',(req,res)=>{
    res.send('Hello world');
});

//если придет post запрос
app.post('/auth/login', (req,res)=>{
    //считываем полученные данные
    console.log(req.body);

    //когда приходит запрос, генерируем token и шифруем информацию
    const token =jwt.sign({
        email:req.body.email,
        fullName: 'Вася Пупкин'
    }, 'secret123');
    res.json({
        succes:true,
        //возвращаем зашифрованный token
        token
    })
})

//поле для авторизации
app.post('/auth/login',loginValidation, UserController.login)

//поле для регистрации
app.post('/auth/register', registerValidation, UserController.register)

//получаем информацию о нас
app.get('/auth/me', checkAuth,UserController.getMe)

//get запрос на получение всех статей
app.get('/posts', PostController.getAll);

//
//app.get('/posts/tags', PostController.getLastTags);

//get запрос на получение оной статьи
app.get('/posts/:id', PostController.getOne);

//post запрос на создание статьи
app.post('/posts', checkAuth, postCreateValidation,  PostController.create);

//запрос на удаление статьи
app.delete('/posts/:id',checkAuth, PostController.remove);

//запрос на обновление статьи
app.patch(checkAuth, postCreateValidation, PostController.update);

//запускаем веб сервер на порте 4444
app.listen(4444, (err)=>{
    if (err){
        return console.log(err);
    }

    console.log("Server OK");
})


