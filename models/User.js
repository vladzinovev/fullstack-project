import mongoose from 'mongoose';


//пишем все свойства которые есть у пользователя
const UserSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    passwordHash:{
        type: String,
        required: true, 
    },

    //аватарка, но она необязательна
    avatarUrl: String
},{
    //дата создания сущности
    timestamps:true
});

export default mongoose.model('User',UserSchema);