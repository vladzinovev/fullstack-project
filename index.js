import express from 'express';

const app = express();

//если приходит get запрос отправляем привет мир (что передаем клиенту)
app.get('/',(req,res)=>{
    res.send('Hello world!');
});

//запускаем веб сервер на порте 4444
app.listen(4444, (err)=>{
    if (err){
        return console.log(err);
    }

    console.log("Server OK");
})

