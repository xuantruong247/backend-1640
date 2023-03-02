const express = require("express"); 
const router = express.Router();
const Department = require('../../models/department')
const User = require('../../models/user')
const { verifyToken, isAdmin} = require('../../middleware/verifyAuth')

//view all department 
//--Method: Get 
router.get('/' , verifyToken, isAdmin, async (req ,res) => {
    try {
        const user = await User.findOne({username: req.user.name}, '-password')
        const departments = await Department.find({})

        res.render('pages/admin/department' ,{
            title: 'List',
            page: 'Department',
            departments,
            user
        })
        //res.json(departments)
    } catch (error) {
        console.log(error)
		return res.status(400).render('pages/404')
    }
})


//create new department
//--Method: Get 

router.get('/create', verifyToken, isAdmin, async (req, res) => {
    try {
        const user = await User.findOne({username: req.user.name}, '-password')

        res.render('pages/admin/department-create', {
            title: 'Create',
            page: 'Department',
            user
        })
    }catch (err) {
        console.log(error)
		return res.status(400).render('pages/404')
    }
})
//--Method: Post 
router.post('/create', verifyToken, isAdmin, async (req ,res) => {
    const {name, description} = req.body
     //validation
    if(!name)
        return res.status(400).render('pages/404')
    try {
        //Check existing department
        const department = await Department.findOne({name})
        if(department)
        return res.status(400).json({success:false , message:'existing department'})
    } catch (error) { 
        console.log(error)
        res.status(500).json({success:false , message:'Error'}) 
    } 
    //create new department        
    try {
        const newDepartment = new Department ({
            name,
            description
        })
        await newDepartment.save()
        res.redirect('/admin/department')
        //res.json({success:true , message:'create success' , department : newDepartment})
    } catch (error) {
        console.log(error)
        return res.status(400).render('pages/404')
    }
})



//update or edit department 
//--Method: Get 
router.get('/edit/:id', verifyToken, isAdmin,  async (req, res) => {
    try {
        const user = await User.findOne({username: req.user.name}, '-password')

		const department = await Department.findOne({
            _id : req.params.id
        })
        //res.json(department)
        res.render('pages/admin/department-edit',{
            title: 'Edit',
            page: 'Department',
            department,
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
        //edit or update department 
    try {
        let editDepartment = {
            name : name || '' ,
            description : description || '' 
        }
        const editedDepartment = await Department.findOneAndUpdate(
            {_id: req.params.id} ,
            editDepartment,
            {new:true}
        )
        if (!editedDepartment){
            return res.status(401).json({success:false , message : 'can not edit department'})
        }
        res.redirect('/admin/department')
        //res.json({success : true ,message:'edit successful' , department : editDepartment})
    
    } catch (error) {
        console.log(error)
        return res.status(400).render('pages/404')
    }
})



//delete department 
//--Method: Get
router.get('/delete/:id', verifyToken, isAdmin,  async (req, res) => {
	try {
		const deletedDepartment = await Department.findByIdAndRemove(req.params.id)

		if (!deletedDepartment)
			return res.status(401).json({
				success: false,
				message: 'cant not delete department'
			})
            res.redirect('/admin/department')
        //res.json({success:true, message: 'deleted success'})
		
	} catch (error) {
        console.log(error)
		return res.status(400).render('pages/404')
	}
})
module.exports = router;