const express = require("express"); 
const router = express.Router();
const Submission = require('../../models/submission')
const Category = require('../../models/category')
const Idea = require('../../models/idea');
const { verifyToken } = require('../../middleware/verifyAuth')
const User = require('../../models/user')
const Department = require('../../models/department')
const Upload = require('../../middleware/multerUpload')
const { sendMail } = require('../../utils/mailer')

//--Method:Get
router.get('/' , verifyToken, async (req ,res) => {
    try {
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
            },
        ])

        

        const recentIdeas = await Idea.find().sort({createdAt: -1}).limit(5)

        const { name, roles } = req.user

        const user = await User.findOne({ username: name })
        // Submission
        let perPage = 6;
        let page = req.params.page || 1; 
        const submissions = await Submission.find().limit(5).skip((perPage * page) - perPage).limit(perPage);
        //count 
        const count = await Submission.countDocuments() 

        res.render('pages/user/submission', {
            title: 'View',
            page: 'Submission',
            submissions,
            user,
            categoryList,
            recentIdeas,
            current: page,
            pages: Math.ceil(count / perPage)
        })

    } catch (error) {
        console.log(error)
		return res.status(400).render('pages/404')
    }
})

router.get('/:page' , verifyToken, async (req ,res) => {
    try {
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

        const { name, roles } = req.user

        const user = await User.findOne({ username: name })
        // Submission
        let perPage = 12;
        let page = req.params.page || 1; 
        const submissions = await Submission.find().limit(5).skip((perPage * page) - perPage).limit(perPage);
        //count 
        const count = await Submission.countDocuments()

        res.render('pages/user/submission', {
            title: 'View',
            page: 'Submission',
            submissions,
            user,
            categoryList,
            recentIdeas,
            current: page,
            pages: Math.ceil(count / perPage)
        })

    } catch (error) {
        console.log(error)
		return res.status(400).render('pages/404')
    }
})

//View idea list (Submission details)
//--Method:Get 
router.get('/:id/view', verifyToken, async (req, res) => {
    try {
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

        const { name, roles } = req.user

        const user = await User.findOne({ username: name }, '-password')

        const submissionId = req.params.id
        const categories = await Category.find()
        const ideas = await Idea.find({ userId: user._id, submissionId })

        res.render('pages/user/submission-idea-list', {
            title: 'View',
            page: 'Submission',
            submissionId,
            categories,
            ideas,
            user,
            categoryList,
            recentIdeas
        })
    } catch (error) {
        console.log(error)
		return res.status(400).render('pages/404')
    }
})

//--Create new idea
//--Method:Get 
router.get('/:id/idea-create', verifyToken, async(req, res) => {
    
    try {
        const { name, roles } = req.user

        const user = await User.findOne({ username: name }, '-password')
        const categories = await Category.find();
        const submissionId = req.params.id

        res.render('pages/user/submission-idea-create', {
            title: 'Create',
            page: 'Idea',
            categories,
            submissionId,
            user
        })
    } catch (error) {
        console.log(error)
		return res.status(400).render('pages/404')
    }
})
//--Method:Post
router.post('/:id/idea-create', verifyToken, Upload.array('files'), async(req, res) => {
    const {title, description, categoryId, content, ideaMode} = req.body
    const submissionId = req.params.id

    if(!title) return res.status(400).render('pages/404')

    try{
        const submission = await Submission.findById(submissionId)
        if(Number(submission.closureDate) < Date.now()) return res.status(400).render('pages/404')

        const user = await User.findOne({
            username : req.user.name
        }, '-password')

        const QACoordinator = await User.findOne({ 'department.departmentId' : user.department.departmentId, 'department.isQACoordinator': true }, '-password')

        var files = []

        if(req.files != undefined){
            req.files.forEach(file => {
                const filePath = `uploads/${submissionId}/${file.filename}`
                files.push({
                    fileName: file.filename,
                    filePath
                })
            });
        }

        const newIdea = new Idea({
            title,
            categoryId,
            description,
            content,
            userId: user._id,
            submissionId,
            files,
            isAnonymously: ideaMode
        })

        

        // //send mail 
        const emailQACoordinatorList = [...QACoordinator.contact.emails]
        const emailUserList = [...user.contact.emails]
        if(emailUserList[0].email){
            const mail = {
                to: emailQACoordinatorList[0].email,
                subject: 'New idea in your department',
                text: `${user.username} + ${emailUserList.email} send new idea is ${newIdea.title}`
            }
            await sendMail(mail)
        }
        

        
        
        await newIdea.save()
        res.redirect(`/submission/${submissionId}/view`)
    } catch (err) {
        console.log(err)
        res.status(500).json({success:false , message:'Error'})
    }
})

//--Edit idea
//--Method:Get 
router.get('/:submissionId/idea-edit/:ideaId', verifyToken,  async(req, res) => {
    try {
        const user = await User.findOne({
            username : req.user.name
        }, '-password')


        const { submissionId, ideaId }= req.params
        const categories = await Category.find();
        const idea = await Idea.findById({ _id: ideaId})

        Idea.f

        res.render('pages/user/submission-idea-edit', {
            title: 'Create',
            page: 'Idea',
            categories,
            submissionId,
            idea,
            user
        })
    } catch (error) {
        console.log(error)
		return res.status(400).render('pages/404')
    }
})
//--Method:Post
router.post('/:submissionId/idea-edit/:ideaId', verifyToken, Upload.array('files'), async(req, res) => {
    const {title, description, categoryId, content, ideaMode} = req.body
    const {submissionId, ideaId} = req.params

    try{
        const submission = await Submission.findById(submissionId)
        if(Number(submission.closureDate) < Date.now()) return res.status(400).render('pages/404')


        const user = await User.findOne({
            username : req.user.name
        }, '-password')
        
        const QACoordinator = await User.findOne({ 'department.departmentId' : user.department.departmentId, 'department.isQACoordinator': true }, '-password')


        var files = []

        if(req.files != undefined){
            req.files.forEach(file => {
                const filePath = `uploads/${submissionId}/${file.filename}`
                files.push({
                    fileName: file.filename,
                    filePath
                })
            });
        }

        const editIdea = {
            title,
            categoryId,
            description,
            content,
            userId: user._id,
            submissionId,
            files,
            isAnonymously: ideaMode != null ? true: false
        }
        
        await Idea.findOneAndUpdate({ _id: ideaId}, editIdea)

        // //send mail 
        const emailQACoordinatorList = [...QACoordinator.contact.emails]
        const emailUserList = [...user.contact.emails]
        if(emailUserList[0].email){
            const mail = {
                to: emailQACoordinatorList[0].email,
                subject: 'New idea in your department',
                text: `${user.username} + ${emailUserList.email} had edited idea is ${editIdea.title}`
            }
            await sendMail(mail)
        }
        

        res.redirect(`/submission/${submissionId}/view`)
    } catch (err) {
        console.log(err)
        res.status(500).json({success:false , message:'Error'})
    }
})


//--Delete idea
//--Method:Get 
router.get('/:submissionId/idea-delete/:ideaId', verifyToken, async(req, res) => {
    const { ideaId, submissionId }= req.params
    
    try {
        const submission = await Submission.findById(submissionId)
        if(Number(submission.closureDate) < Date.now()) return res.status(400).render('pages/404')

       
        await Idea.deleteOne({ _id: ideaId})
        res.redirect(`/submission/${submissionId}/view`)
    } catch (error) {
        console.log(error)
		return res.status(400).render('pages/404')
    }
})

//--Details idea
//--Method:Get 
router.get('/:submissionId/idea/:ideaId', verifyToken, async(req, res) => {
    try {
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

        const recentIdeas = await Idea.find().sort({createdAt: -1})

        const { ideaId, submissionId }= req.params

        const idea = await Idea.findById({ _id: ideaId})
        const user = await User.findById({ _id: idea.userId})
        const userDepartment = await Department.findById({ _id: user.department.departmentId }) 
        const ideaCategory = await Category.findById({_id: idea.categoryId})


        res.render('pages/user/submission-idea-detail', {
            title: 'Detail',
            page: 'Idea',
            idea,
            submissionId,
            user,
            userDepartment,
            ideaCategory,
            categoryList,
            recentIdeas
        })
    } catch (error) {
        console.log(error)
		return res.status(400).render('pages/404')
    }
})

module.exports = router;