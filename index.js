import express from 'express';
import jwt from 'jsonwebtoken';
const app = express();
import mongoose from 'mongoose';

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
app.post('/auth/login',(req,res)=>{
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

//запускаем веб сервер на порте 4444
app.listen(4444, (err)=>{
    if (err){
        return console.log(err);
    }

    console.log("Server OK");
})


