const Article = require('../models/article')

class ArticleController {

    static add(req, res, next){
        console.log('masul');
        // console.log('req.file.cloudStoragePublicUrl: ', req.file.cloudStoragePublicUrl);
        console.log('req.body.tags: ', req.body.tags);
        req.body.tags = req.body.tags.split(',')
        let tags = [...new Set(req.body.tags)]
        console.log('tags: ', tags);
        console.log('req.headers.userId: ', req.loggedUser._id, req.loggedUser.username);
            
        let newArt = new Article({
            userId : req.loggedUser._id,
            title : req.body.title,
            text : req.body.text,
            date : req.body.date,
            img : req.file.cloudStoragePublicUrl ? req.file.cloudStoragePublicUrl : req.body.img,
            tags    
        })

        newArt.save()
            .then(data => {
                res.status(201).json(data)
            })
            .catch(next)
    }

    static delete(req, res, next){
        Article.findByIdAndDelete(req.params.id)
            .then(data => {
                res.json({data, msg : 'deleted'})
            })
            .catch(next)
    }

    static update(req, res, next){
        let { title, text, img, date, tags, likes, status } = req.body

        let obj = {}
        if(title) obj.title = title
        if(text) obj.text = text
        if(img) obj.img = img
        if(date) obj.date = date
        if(tags) obj.tags = tags
        if(likes) obj.likes = likes
        if(status) obj.status = status
        
        Article.findByIdAndUpdate(req.params.id, obj)
            .then(data => {
                res.json({data, msg : 'updated'})
            })
            .catch(next)
    }

    static findAll(req, res, next){
        let array = [req.loggedUser._id]
        console.log('req.loggedUser._id: ', req.loggedUser._id);
        
        req.loggedUser.following.forEach(el => {
            console.log('el: ', el);
            array.push(el)
        });
        
        console.log('array: ', array);
        Article.find({
            userId : {
                $in : array
            }
        })
            .populate('userId')
            .then(data => {
                
                console.log('data: ', data, data.length);
                res.json(data)
            })
            .catch(next)
    }

    static findByUser(req, res, next){
        console.log(req.params.userId, '=============')
        Article.find({
            userId : req.params.userId
        })
            .populate('userId')
            .then(data => {
                console.log(data, '>>>>>>>>>>>>>');
                res.json(data)
            })
            .catch(next)
    }

    static async search(req, res, next){

    }

    static async like(req, res, next){
        try {
            console.log('req.body.id: ', req.params.id);
            let newLike = await Article.findById(req.params.id)
            console.log('newLike: ', newLike);

            newLike.likes.push(req.loggedUser._id)

            let saving = await newLike.save()
            

            console.log('saving: ', saving);

            res.json({msg: 'like success'})

        } catch (error) {
            next(error)
        }
    }

    static async unlike(req, res, next){
        try {
            let newLike = await Article.findByIdAndUpdate(req.params.id, {
                $pull : {
                    likes : {
                        $in : req.loggedUser._id
                    }
                }
            })
            console.log('newLike: ', newLike);

            res.json({msg: 'unlike success'})
            
        } catch (error) {
            next(error)
        }
    }

}

module.exports = ArticleController