import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import UserModel from '../models/User.js';

export const register = async (req,res)=>{
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
  
      const {passwordHash, ...userData}=user._doc;
      //если нет ошибок
      res.json({
          ...userData,
          token
      })
  }catch (err){
      console.log(err);
      res.status(500).json({
          message: 'Не удалось зарегистрироваться',
      })
  }
};

export const login = async (req,res)=>{
  try {
      const user = await UserModel.fundOne({email: req.body.email});

      if(!user){
          return res.status(404).json({
              message: "Пользователь не найден",
          })
      }

      //сверяем пароль
      const isValidPass= await bcrypt.compare(req.body.password, user._doc.passwordHash);

      if (!isValidPass) {
        return res.status(400).json({
          message: 'Неверный логин или пароль',
        });
      }

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
          ...userData,
          token
      })
  }catch (err){
      console.log(err);
      res.status(500).json({
          message: 'Не удалось авторизоваться',
      })
  }
};

export const getMe =  async (req,res)=>{
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
};
