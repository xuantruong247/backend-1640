const User = require('../models/user')
const express = require("express")
const router = express.Router() 
const argon2 = require("argon2")
const jwt = require("jsonwebtoken")
require('dotenv').config()
const { loginValidation} = require("../middleware/validation")
const {verifyToken} = require("../middleware/verifyAuth")
const Role = require('../models/role')



//-- Login
//-Method: Get
router.get('/login', verifyToken, async (req, res) => {
    try{
        if(req.user){
            res.redirect('/')
        }
        res.render('pages/auth/login', {
            title: 'Login'
        })
    } catch (err) {
        console.log(error)
		return res.status(400).render('pages/404')
    }
})

//-Method: Post
router.post('/login', async (req, res) => { 
    //Validation
    const { error } = loginValidation(req.body)
    if(error)
    return res.status(400).render('pages/404')

    try{
        //Find user
        const user = await User.findOne({ username: req.body.username});
    
        //Check exist the user
        if (!user)
		return res.status(400).render('pages/404')
    
        //Check password
        const validPassword = await argon2.verify(user.password, req.body.password)
        if (!validPassword)
		return res.status(400).render('pages/404')
        
        //Find role
        const roles = await Role.find()

        //Create role
        let roleList = []

        user.roles.forEach(role => {
            for(let i = 0; roles[i] != undefined; i++){
                if(role.roleId == roles[i].id) return roleList.push(roles[i].name)
            }
        });
        //Create a token
        const accessToken = jwt.sign({name: user.username, roles: roleList}, process.env.ACCESS_TOKEN_SECRET); 
        res.cookie("token", accessToken);
        for(let i = 0; roleList[i] != undefined; i++){
            if(roleList[i] == "Admin" || roleList[i] == "QA manager"){
                return res.redirect('/admin')
            }
        }
        res.redirect("/")
        //res.header('Auth-Access-Token', accessToken).send(accessToken);
    } catch(error){
        console.log(error)
		return res.status(400).render('pages/404')
    }
});

//Logout
//--Method:Get 
router.get('/logout', (req, res) => {
    try{
        res.clearCookie('token')
        res.redirect('/login')
    } catch(err){
        console.log(error)
		return res.status(400).render('pages/404')
    }
})

module.exports = router;