import PostModel from '../models/Post.js';


export const create = async (req, res) => {
    try {
      
        //создаем документ (у которого есть нижеперечисленные параметры)
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags.split(','),
            user: req.userId,
        });
        
        //после того как подготовили документ, мы его создаем
        const post = await doc.save();

        res.json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось обновить статью',
        });
    }
};
