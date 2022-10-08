import express from 'express';
import jwt from 'jsonwebtoken';
const app = express();
import mongoose from 'mongoose';
import { registerValidation} from './validations/auth.js';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import UserModel from './models/User.js';
import { checkAuth } from './utils/index.js';

//подключаем БД
mongoose.connect('mongodb+srv://admin:adm123@cluster0.j7ewm4r.mongodb.net/?retryWrites=true&w=majority')
    .then(()=>console.log('connect to DB OK'))
    .catch((err)=>console.log('DB error', err))

//научили читать json запросы
app.use(express.json())

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
app.post('/auth/login', async (req,res)=>{
    try {
        const user = await UserModel.fundOne({email: req.body.email});

        if(!user){
            return res.status(404).json({
                message: "Не верный логин или пароль",
            })
        }

        //сверяем пароль
        const isValidPass= await bcrypt.compare();

        //шифруем нашего пользователя в бд
        const token = jwt.sign(
            {
                _id:user._id,
            },
            //ключ с помощю которогошифруем информацию
            'secret123',
            {
                //срок жизни token
                expiresIn: '30d',
            },

        )

        const {passwordHash, ...userData}=user._data;
        //если нет ошибок
        res.json({
            success:true,
            ...userData,
            token
        })
    }catch (err){
        console.log(err);
        res.status(500).json({
            message: 'Не удалось авторизоваться',
        })
    }
})

//поле для регистрации
app.post('/auth/register', registerValidation ,async (req,res)=>{
    try{
        const errors = validationResult(req);
        //если есть ошибка
        if(!errors.isEmpty()){
            return res.status(400).json(errors.array());
        }
    
        //шифруем пароль
        const password = req.body.password;
        //алгоритм шифрования нашего пароля
        const salt = await bcrypt.genSalt(10);
        //шифруем пароль
        const hash = await bcrypt.hash(password, salt);
    
        //подготавливаем документ для создани япользователя
        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        });
    
        //создаем самого пользователя (сохраняем документ в бд)
        const user = await doc.save();

        //шифруем нашего пользователя в бд
        const token = jwt.sign(
            {
                _id:user._id,
            },
            //ключ с помощю которогошифруем информацию
            'secret123',
            {
                //срок жизни token
                expiresIn: '30d',
            },

        )
    
        const {passwordHash, ...userData}=user._data;
        //если нет ошибок
        res.json({
            success:true,
            ...userData,
            token
        })
    }catch (err){
        console.log(err);
        res.status(500).json({
            message: 'Не удалось зарегистрироваться',
        })
    }
})

//получаем информацию о нас
app.get('/auth/me', checkAuth, async (req,res)=>{
    try{
        const user = await UserModel.findById(req.userId);
        
        //если пользователь не найден
        if(!user){
            return res.status(404).json({
                message: 'Пользователь не найден'
            });
        }

        const {passwordHash, ...userData}=user._data;
        //если нет ошибок
        res.json({userData})

    } catch (err){
        console.log(err);
        res.status(500).json({
            message: 'Нет доступа',
        })
    }
})

//запускаем веб сервер на порте 4444
app.listen(4444, (err)=>{
    if (err){
        return console.log(err);
    }

    console.log("Server OK");
})


