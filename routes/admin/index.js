const express = require("express")
const router = express.Router()
const {verifyToken, isAdmin} = require('../../middleware/verifyAuth')
const User = require('../../models/user')
const Idea = require('../../models/idea')
const Department = require('../../models/department')
const idea = require("../../models/idea")
const Comment = require("../../models/comment")
const comment = require("../../models/comment")
const { NIL } = require("uuid")
const { count } = require("../../models/user")
//-- Login 
//-Method: Post
router.get('/', verifyToken, isAdmin , async (req, res) => { 
    try{
        const user = await User.findOne({username: req.user.name}, '-password')
        //Idea Each Department
        const ideaEachDepartment = await Idea.aggregate([
            { 
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
            }},
            { $unwind: "$user" },
            {
                $lookup : {
                    from :"departments",
                    localField : "user.department.departmentId",
                    foreignField : "_id",
                    as : "user.department"
                }
            },
            {$unwind : "$user.department"},
            {
                $group :{
                    _id : "$user.department._id",
                    name: {"$first" : "$user.department.name"},
                    count: { $sum: 1}
                }
            }

        ])
        // res.json(ideaEachDepartment)
        //End Idea Each Department

        // % Idea Each Department
        const total = await Idea.count()
        const percentageIdeaEachDepartment = await Idea.aggregate([
            { 
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
            }},
            { $unwind: "$user" },
            {
                $lookup : {
                    from :"departments",
                    localField : "user.department.departmentId",
                    foreignField : "_id",
                    as : "user.department"
                }
            },
            {$unwind : "$user.department"},
            {
                $group :{
                    _id : "$user.department._id",
                    name: {"$first" : "$user.department.name"},
                    count: { $sum: 1},

                }
            },
            { "$project": { 
                "name" : 1 ,
                "count": 1, 
                "percentage": { 
                    "$multiply":[{ "$divide":["$count", {"$literal": total }]},100]}
                }
            }

        ])
        // End % Idea Each Department

        //Number User Posted Idea Each Department
        const userPostedIdeaEachDepartment = await Idea.aggregate([
            { 
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
            }},
            { $unwind: "$user" },
            {
                $lookup:{
                    from : "departments",
                    localField : "user.department.departmentId",
                    foreignField :"_id",
                    as :"user.department"
                }
            },{ $unwind: "$user.department" },
            {
                $group: {
                    _id : "$user.department._id",
                    name : {"$first" : "$user.department.name"},
                    count : {$sum : 1}
                }
            }
        ])
        //End Number User Posted Idea Each Department

        // IDea have no comment
        // const ideaHaveNoComment = await Idea.aggregate([
        //     {
        //         $match : {
        //             comments : []      
        //         }

        //     },
        //     { $group: { 
        //             _id:null , 
        //             count: { $sum: 1 } ,
        //             idea: { 
        //                 "$push": { 
        //                     "ideaId": "$_id", 
        //                     "ideaTitle": "$title" ,
        //                     "ideaContent":"$content"
        //                 } 
        //             },
        //         } 
        //     },
                
        // ])
        // const ideaHaveNoComment = await Idea.aggregate([
        //     {
        //         $match : {
        //             comments :[] 
        //         }
        //     },
        //     {
        //         $group :{
        //             _id : null ,
        //             idea :{
        //                 "$push": { 
        //                     "ideaTitle": "$title" 
        //                 } 
        //             },
        //             count :{$sum :1}
        //         }
        //     }
        // ]
        // )
        const noComment = await Idea.find({
            comments : { $exists: true,$size: 0 }
        })

        // End IDea have no comment

        const anonymouslyIdea = await Idea.find({
            isAnonymously : 1
        })
        //
        res.render('pages/admin/', {
            page: 'Admin',
            title: 'Dashboard',
            user,
            ideaEachDepartment,
            percentageIdeaEachDepartment,
            userPostedIdeaEachDepartment,
            anonymouslyIdea,
            noComment
        })
    } catch(error){
        console.log(error)
        res.status(400).json({success:false , message:'Error'}) 
    }
});

module.exports = router;