const express = require("express"); 
const router = express.Router();
const { verifyToken } = require('../../middleware/verifyAuth')
const User = require('../../models/user')
 
router.get('/', verifyToken, async (req ,res) => {
    if(req.user == null) return res.redirect('/login')
    try {
        const { name } = req.user
        const user = await User.findOne({ username: name })
        if(!user) return res.status(400).send({success: fail, message: 'Can\'t find user'})
        res.render('pages/user',{
            title: '',
            page: 'Home',
            user
        })
    } catch (error) {
        console.log(error)
		return res.status(400).render('pages/404')
    }
})

module.exports = router;