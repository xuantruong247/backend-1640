const express = require("express");
const router = express.Router();
const argon2 = require("argon2")
const User = require('../../models/user')
const Role = require('../../models/role');
const Department = require('../../models/department')
const { verifyToken } = require('../../middleware/verifyAuth')

//Edit and update user
//-- get
router.get('/', verifyToken, async (req, res) => {
    try {
		const user = await User.findOne({ username: req.user.name})
        const roles = await Role.find()
        const departments = await Department.find()
        res.render('pages/user/setting', {
            title: "Edit",
            page: "User",
            user,
            roles,
            departments
        })
    }catch (error) {
        console.log(error)
		return res.status(400).render('pages/404')
    }
})

//-- Post 
router.post('/' , verifyToken, async(req,res)=>{
    const {fullName, departmentId,emails, phones, streets, cities, countries, ideaMode, commentMode} = req.body

    if(!emails[0]) return res.status(400).render('pages/404')

    try {
        

        //Create contact field (object)
        let contact = {
            emails: [],
            phones: [],
            addresses:[]
        }
        //Anonymously filed
        let anonymously = {
            idea: ideaMode ? true : false,
            comment: commentMode ? true : false
        }
        //Handle contact request
        if(emails != undefined){
            emails.forEach(email => {
                if(email == "") return
                contact.emails.push({email})
            });
        }
        if(phones != undefined){
            phones.forEach(phone => {
                if(phone == "") return
                contact.phones.push({phone})
            });
        }
        if(streets || cities || countries){
            for(let i = 0; streets[i] != undefined; i++){
                if(streets[i] == "" && cities[i] == "" && countries[i] == "") continue
                const addressHandle = { street: streets[i],
                                        city: cities[i],
                                        country: countries[i]
                                    }
                contact.addresses.push(addressHandle)
            }
        }
        const user = await User.findOne({username: req.user.name})

        let editUser = {
            fullName: fullName,
            contact: contact,
            departmentId,
            anonymously
        }
        
        // Update user to database
        const updatedUser = await User.findOneAndUpdate({_id: user._id}, editUser, {new: true})
        var id= req.params.id;
        res.redirect('/setting')

        
    } catch (error) { 
        console.log(error)
		return res.status(400).render('pages/404')
    } 
})

//-- Get
router.get('/setting-password', verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({ username: req.user.name }, '-password')

        res.render('pages/user/setting-password', {
            title: 'Password',
            page: 'setting',
            user
        })
    }catch (error) {
        console.log(error)
		return res.status(400).render('pages/404')
    }
})

//-- Post 
router.post('/setting-password/:id', verifyToken , async(req,res)=>{
    try {
        const { password, rePassword } = req.body
    
        if(!password || !rePassword) return res.status(400).render('pages/404')

        if(password != rePassword) return res.status(400).render('pages/404')
        const hashPassword = await argon2.hash(password)

        await User.findByIdAndUpdate(req.params.id, {
            password: hashPassword
        })
        
        res.redirect('/setting')

    } catch (error) { 
        console.log(error)
		return res.status(400).render('pages/404')   
    } 
})


module.exports = router;