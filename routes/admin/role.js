const express = require("express");
const router = express.Router();
const Role = require('../../models/role')
const User = require('../../models/user')
const { verifyToken, isAdmin} = require('../../middleware/verifyAuth');
const user = require("../../models/user");

//view all role 
//--Method: Get 
router.get('/', verifyToken, isAdmin, async (req ,res) => {
    try {
        const user = await User.findOne({ username: req.user.name}, '-password') 

        const roles = await Role.find({})
        res.render('pages/admin/role' ,{
            title: 'Role List',
            page: 'Role',
            roles,
            user
        })
    } catch (error) {
        console.log(error)
		return res.status(400).render('pages/404')
    }
})


//create new role
//--Method: Get 
router.get('/create', verifyToken, isAdmin, async (req, res) => {
    try {
        const user = await User.findOne({username: req.user.name}, '-password')

        res.render('pages/admin/role-create', {
            title: 'Create',
            page: 'Role',
            user
        })
    }catch (err) {
        console.log(error)
		return res.status(400).render('pages/404')
    }
})

//--Method: Post 
router.post('/create',  verifyToken, isAdmin, async (req ,res) => {
    const {name, description} = req.body
     //validation
    if(!name) return res.status(400).render('pages/404')
    try {
        //Check existing role
        const role = await Role.findOne({name})
        if(role)
		return res.status(400).render('pages/404')
    } catch (error) { 
        console.log(error)
		return res.status(400).render('pages/404')
    } 
    //create new role        
    try {
        const newRole = new Role ({
            name,
            description
        })
        await newRole.save()
        res.redirect('/admin/role')
        //res.json({success:true , message:'create success' , role : newRole})
    } catch (error) {
        console.log(error)
		return res.status(400).render('pages/404')
    }
})



//update or edit role 
//--Method: Get 
router.get('/edit/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const user = User.findOne({username: req.user.name}, '-password')

		const role = await Role.findOne({
            _id : req.params.id
        })
        res.render('pages/admin/role-edit',{
            title: 'Edit',
            page: 'Role',
            role,
            user
        })
    }catch (error) {
        console.log(error)
		return res.status(400).render('pages/404')
    }
})

//--Method: Post  
router.post('/edit/:id', verifyToken, isAdmin, async(req,res)=>{
    const {name , description} = req.body
    //validation
    if(!name)
    return res.status(400).render('pages/404')
        //edit or update account
    try {
        let editRole = {
            name : name || '' ,
            description : description || '' 
        }
        const editedRole = await Role.findOneAndUpdate(
            {_id: req.params.id} ,
            editRole,
            {new:true}
        )
        if (!editedRole){
            return res.status(401).json({success:false , message : 'cant not edit role'})
        }
        res.redirect('/admin/role')
        //res.json({success : true ,message:'edit successful' , role : editRole})
    
    } catch (error) {
        console.log(error)
		return res.status(400).render('pages/404')
    }
})



//delete account 
//--Method: Get
router.get('/delete/:id', verifyToken, isAdmin, async (req, res) => {
    // const role = await Role.findOne({_id: req.params.id})
    // res.json(role)
	try {
		const deletedRole = await Role.findByIdAndRemove(req.params.id)

		if (!deletedRole)
			return res.status(401).json({
				success: false,
				message: 'cant not delete account'
			})

		res.redirect('/admin/role')
	} catch (error) {
		console.log(error)
		return res.status(400).render('pages/404')
	}
})
module.exports = router;