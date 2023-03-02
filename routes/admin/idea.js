const express = require("express"); 
const router = express.Router();
const Idea = require('../../models/idea')
const User = require('../../models/user')
const {verifyToken, isAdmin} = require('../../middleware/verifyAuth')
//view all idea 
//--Method: Get 
router.get('/', verifyToken, isAdmin, async (req ,res) => {
    try {
        const user = await User.findOne({username: req.user.name}, '-password')

        const ideas = await Idea.find().populate({
            path: 'userId', 
            select: ['department', 'username', 'fullName'],
            populate: {
                path: 'department.departmentId'
            }
        }).populate('categoryId').populate('submissionId')
        
        res.render('pages/admin/idea' ,{
            title: 'View List',
            page: 'Idea',
            ideas,
            user
        })
    } catch (error) {
        console.log(error)
		return res.status(400).render('pages/404')
    }
})

//delete idea 
//--Method: Get
router.get('/delete/:id', verifyToken, isAdmin, async (req, res) => {
	try {
		const deletedIdea = await Idea.findByIdAndRemove(req.params.id)

		if (!deletedIdea)
			return res.status(401).json({
				success: false,
				message: 'cant not delete account'
			})

		res.redirect('/admin/idea')
	} catch (error) {
		console.log(error)
		return res.status(400).render('pages/404')
	}
})

//detail idea
//--Method: Get 
router.get('/detail/:id', verifyToken, isAdmin, async (req, res) => {
    const ideaId = req.params.id

    try {
        const user = await User.findOne({username: req.user.name}, '-password')

        const idea = await Idea.findById(ideaId).populate({
            path: 'userId',
            select: '-password',
            populate: 'department.departmentId',
            populate: 'roles.roleId'
        }).populate({
            path: 'comments.commentId',
            populate: {
                path: 'userId',
                select: '-password'
            }
        })

        // res.json(idea)
		res.render('pages/admin/idea-detail', {
            idea,
            user
        })
	} catch (error) {
		console.log(error)
		return res.status(400).render('pages/404')
	}
})

module.exports = router;