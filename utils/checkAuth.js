import jwt from 'jsonwebtoken';

//функция посредник, которая проверяет можно ли сообщать какую либо информацию обо мне
export default (req, res, next) => {
    //проверяем пришнл token или нет
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

    if (token) {
        try {
            //расшифровываем token
            const decoded = jwt.verify(token, 'secret123');
            
            //если смогли расшифровать передаем id
            req.userId = decoded._id;
            next();

        } catch (e) {
            return res.status(403).json({
                message: 'Нет доступа',
            });
        }
    } else {
        return res.status(403).json({
            message: 'Нет доступа',
        });
    }
};