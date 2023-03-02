const express = require('express') 
const router = express.Router()
const Idea = require('../../models/idea')
const User = require('../../models/user')
const { verifyToken } = require('../../middleware/verifyAuth')
const Comment = require('../../models/comment')
const Reaction = require('../../models/reaction')
const ideaAnonymous = require('../../models/ideaAnonymous')
const View = require('../../models/view')
const { sendMail } = require('../../utils/mailer')

//List idea
//--Method:Get 
router.get('/', verifyToken ,async (req, res) => {
    try{
        //Variable
        //--User 
        const { name } = req.user
        const user = await User.findOne({ username: name})
        //--End User
        //--Pagination
        let perPage = 5;
        let page = req.query.page || 1; 
        const count = await Idea.countDocuments()
        //--End Pagination
        //--Side bar
        const categoryList = await Idea.aggregate([
            { 
                $lookup: {
                    from: "categories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "categories"
            }},
            { $unwind: "$categories" },
            {
                $group: {
                    _id: "$categories._id",
                    name: { "$first": "$categories.name" },
                    count: { $sum: 1}
                }
            }
        ])

        const recentIdeas = await Idea.find().sort({createdAt: -1}).limit(5)
        //--End sidebar
        //View Idea list 
        const filter = req.query.filter || "newest"
        let ideas = await Idea.find().sort({createdAt: -1}).populate('userId', ['fullName', '_id']).populate('submissionId').skip((perPage * page) - perPage).limit(perPage)
        if(filter == "reaction"){
            ideas = await Idea.aggregate(
                [
                    {
                        $lookup: {
                            from: "users",
                            let: { "userId": "$userId" },
                            pipeline: [
                                { $match: { $expr: { $eq: ["$_id", "$$userId"] }}},
                                { $project: { "username": 1, "fullName": 1, "roles":1, "department":1, "anonymously": 1, contact: 1}}
                            ],
                            as: "userId"
                        } 
                    },
                    {
                        $unwind: "$userId"
                    },
                    {
                        $lookup: {
                            from: "submissions",
                            let: { "submissionId": "$submissionId" },
                            pipeline: [
                                { $match: { $expr: { $eq: ["$_id", "$$submissionId"] }}},
                                { $project: { "name": 1, "description": 1, "closureDate":1, "finalClosureDate":1, "createdAt": 1}}
                            ],
                            as: "submissionId"
                        } 
                    },
                    {
                        $unwind: "$submissionId"
                    }
                    ,
                    { "$project": {
                        "title": 1,
                        "categoryId": 1,
                        "description": 1,
                        "userId": 1,
                        "submissionId": 1,
                        "comments": 1,
                        "reactions": 1,
                        "views": 1,
                        "isActive": 1,
                        "isAnonymously": 1,
                        "createdAt": 1,
                        "updatedAt": 1,
                        "length": { "$size": "$reactions" }
                    }},
                    { $sort: { "length": -1 } },
                    { $skip: (perPage * page) - perPage},
                    { $limit: perPage },
                    
                ]
            )
        }
        if(filter == "view"){
            ideas = await Idea.aggregate(
                [
                    {
                        $lookup: {
                            from: "users",
                            let: { "userId": "$userId" },
                            pipeline: [
                                { $match: { $expr: { $eq: ["$_id", "$$userId"] }}},
                                { $project: { "username": 1, "fullName": 1, "roles":1, "department":1, "anonymously": 1, contact: 1}}
                            ],
                            as: "userId"
                        } 
                    },
                    {
                        $unwind: "$userId"
                    },
                    {
                        $lookup: {
                            from: "submissions",
                            let: { "submissionId": "$submissionId" },
                            pipeline: [
                                { $match: { $expr: { $eq: ["$_id", "$$submissionId"] }}},
                                { $project: { "name": 1, "description": 1, "closureDate":1, "finalClosureDate":1, "createdAt": 1}}
                            ],
                            as: "submissionId"
                        } 
                    },
                    {
                        $unwind: "$submissionId"
                    }
                    ,
                    { "$project": {
                        "title": 1,
                        "categoryId": 1,
                        "description": 1,
                        "userId": 1,
                        "submissionId": 1,
                        "comments": 1,
                        "reactions": 1,
                        "views": 1,
                        "isActive": 1,
                        "isAnonymously": 1,
                        "createdAt": 1,
                        "updatedAt": 1,
                        "length": { "$size": "$views" }
                    }},
                    { $sort: { "length": -1 } },
                    { $skip: (perPage * page) - perPage},
                    { $limit: perPage },
                    
                ]
            )
        }
        if(filter == "comment"){
            ideas = await Idea.aggregate(
                [
                    {
                        $lookup: {
                            from: "users",
                            let: { "userId": "$userId" },
                            pipeline: [
                                { $match: { $expr: { $eq: ["$_id", "$$userId"] }}},
                                { $project: { "username": 1, "fullName": 1, "roles":1, "department":1, "anonymously": 1, contact: 1}}
                            ],
                            as: "userId"
                        } 
                    },
                    {
                        $unwind: "$userId"
                    },
                    {
                        $lookup: {
                            from: "submissions",
                            let: { "submissionId": "$submissionId" },
                            pipeline: [
                                { $match: { $expr: { $eq: ["$_id", "$$submissionId"] }}},
                                { $project: { "name": 1, "description": 1, "closureDate":1, "finalClosureDate":1, "createdAt": 1}}
                            ],
                            as: "submissionId"
                        } 
                    },
                    {
                        $unwind: "$submissionId"
                    }
                    ,
                    { "$project": {
                        "title": 1,
                        "categoryId": 1,
                        "description": 1,
                        "userId": 1,
                        "submissionId": 1,
                        "comments": 1,
                        "reactions": 1,
                        "views": 1,
                        "isActive": 1,
                        "isAnonymously": 1,
                        "createdAt": 1,
                        "updatedAt": 1,
                        "length": { "$size": "$comments" }
                    }},
                    { $sort: { "length": -1 } },
                    { $skip: (perPage * page) - perPage},
                    { $limit: perPage },
                    
                ]
            )
        }
        
        //count page     
        
        const ideaList = ideaAnonymous.arrayFilter(ideas)

        res.render('pages/user/idea', {
            title: 'List',
            page: 'Idea',
            ideas: ideaList,
            user,
            categoryList,
            recentIdeas,
            current: page,
            pages: Math.ceil(count / perPage),
            filter
        })
    } catch(err) {
        console.log(error)
		return res.status(400).render('pages/404')
    }
})

//Idea detail
//--Method:get 
router.get('/:id/read', verifyToken, async (req, res) => {
    try{ 
        const categoryList = await Idea.aggregate([
            { 
                $lookup: {
                    from: "categories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "categories"
            }},
            { $unwind: "$categories" },
            {
                $group: {
                    _id: "$categories._id",
                    name: { "$first": "$categories.name" },
                    idea: { 
                        "$push": { 
                            "ideaId": "$_id", 
                            "ideaTitle": "$title" 
                        } 
                    },
                    count: { $sum: 1}
                }
            }
        ])

        const recentIdeas = await Idea.find().sort({createdAt: -1}).limit(5)

        const { name } = req.user
        const user = await User.findOne({ username: name})
        const idea = await Idea.findById(req.params.id).populate({
            path: 'userId',
            select: ['username', 'fullName'],
            populate: {
                path: 'department.departmentId'
            }
        }).populate('categoryId').populate({
            path: 'comments.commentId',
            populate: {
                path: 'userId',
                select: ['username', 'fullName']
            }
        }).populate({
            path: 'reactions.reactionId'
        }).populate({
            path: 'views.viewId',
            populate: {
                path: 'userId',
                select: ['username', 'fullName']
            }
        })

        const viewIdea = await Idea.findById(req.params.id, 'views').populate({
            path: 'views.viewId',
            populate: {
                path: 'userId',
                select: ['username', 'fullName'],
                match: { _id: user._id }
            }
        })

        const ideaFilter = ideaAnonymous.singleFilter(idea)

        if(viewIdea.views.length == 0 || viewIdea.views[0].userId == null) {
           
            const newView = new View({
                isVisited: true,
                userId: user._id
            })

            await newView.save()

            await Idea.findByIdAndUpdate(idea._id, {
                $push: {views : {viewId: newView._id}}
            })
        } else {
            await View.findByIdAndUpdate(viewIdea.views[0].viewId._id, {isVisited: true})
        }
        
        res.render('pages/user/idea-detail', {
            title: 'View',
            page: 'Idea',
            user,
            idea: ideaFilter,
            categoryList,
            recentIdeas
        })
    } catch (err) {
        console.log(error)
		return res.status(400).render('pages/404')
    }
} )


//--Idea comment
//--Method:post 
router.post('/:ideaId/comment',verifyToken, async (req, res) =>{
    const {ideaId} = req.params
    const {content, commentMode} = req.body

    if(!content) res.status(400).json({success: false, message: 'Missing test'})

    try {
        const user = await User.findOne({
            username: req.user.name
        })

        const idea = await Idea.findById(ideaId).populate('userId', '-password').populate('submissionId')
        if(Number(idea.submissionId.finalClosureDate) < Date.now()) return res.status(400).json({success: false, message: 'Submission Comment Close'})
        
        const comment = new Comment({
            content,
            userId :user._id,
            isAnonymously: commentMode
        })

        await comment.save() 

        await idea.update({
            $push: {comments : {commentId: comment._id}}
        })

        //Send email

        if(idea.userId.contact.emails[0].email){
            const mail = {
                to: idea.userId.contact.emails[0].email,
                subject: `New comment in your idea(${idea.title}) in submission(${idea.submissionId.name})`,
                text: `${user.username} + ${user.contact.emails[0].email} send comment is ${comment.content}`
            }
            await sendMail(mail)
        }

        res.redirect(`/idea/${ideaId}/read`)
    } catch (error) {
        console.log(error)
		return res.status(400).render('pages/404')
    }
})

//Delete Comment
//--Method Get 
router.get('/:id/comment/:commentId/delete', verifyToken, async (req, res) => {
    const {id, commentId} = req.params
    if(!id || !commentId) return res.status(400).render('pages/404')
    try{ 
        await Idea.findOneAndUpdate(
            { _id: id}, 
            { $pull: { comments: { commentId: commentId} } },
        );
        await Comment.findByIdAndRemove(commentId)
        res.redirect(`/idea/${id}/read`)
    } catch (err) {
        console.log(error)
		return res.status(400).render('pages/404')
    }
} )

//--Idea reaction
//--Method: post 
router.post('/:ideaId/reaction', verifyToken, async(req, res) => {
    try {
        const ideaId = req.params.ideaId

        const user = await User.findOne({
            username: req.user.name
        })

        

        const idea = await Idea.findById(ideaId).populate({
            path: 'reactions.reactionId'
        })

        let result = false
        let i = 0;
        for(i; idea.reactions[i] != undefined; i++){
            if(idea.reactions[i].reactionId.userId.toString() == user._id.toString()){
                result = true;
                break;
            }
        }

        if(result == true) {
            const reactionId = idea.reactions[i].reactionId._id

            const update = await Idea.findByIdAndUpdate(ideaId, {
                $pull: {reactions: {reactionId: reactionId}}
            })

            await Reaction.findByIdAndRemove(reactionId)

            const findIdea = await Idea.findById(ideaId).populate({
                path: 'reactions.reactionId',
                match: { userId: user._id }
            })

            res.json({idea: findIdea})
        }
        else{
            const reaction = new Reaction({
                reactionType: 1,
                userId: user._id
            })

            await reaction.save()

            const update = await Idea.findByIdAndUpdate(ideaId, {
                $push: {reactions: {reactionId: reaction._id}}
            })

            const findIdea = await Idea.findById(ideaId).populate({
                path: 'reactions.reactionId'
            })

            res.json({idea: findIdea})
        }
    } catch (err) {
        console.log(error)
		return res.status(400).render('pages/404')
    }
})

module.exports = router