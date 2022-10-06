import express from 'express';

const app = express();

//научили читать json запросы
app.use(express.json())

//если приходит get запрос отправляем привет мир (что передаем клиенту)
app.get('/',(req,res)=>{
    res.send('Hello world!');
});

//если придет post запрос
app.post('/auth/login',(req,res)=>{
    //считываем полученные данные
    console.log(req.body);
    res.json({
        succes:true,
    })
})

//запускаем веб сервер на порте 4444
app.listen(4444, (err)=>{
    if (err){
        return console.log(err);
    }

    console.log("Server OK");
})


