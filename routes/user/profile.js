const express = require("express"); 
const router = express.Router();
const User = require('../../models/user');
const Role = require('../../models/role');
const Department = require('../../models/department')
const { verifyToken } = require('../../middleware/verifyAuth')

//View profile list 
router.get('/:id' , verifyToken, async (req ,res) => {
    try {
        const user = await User.findOne({ username: req.user.name}, '-password')

        const userProfile = await User.findOne({
            _id :req.params.id
        }, '-password')
        const roles = await Role.find()
        const departments = await Department.find()

        res.render('pages/user/profile',{
            title: 'Profile',
            page: 'User',
            userProfile,
            roles,
            departments,
            user
        })
    } catch (error) {
        console.log(error)
		return res.status(400).render('pages/404')
    }
})

module.exports = router;