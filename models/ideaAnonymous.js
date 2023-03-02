const comment = require("./comment")

let ideaList = []
 
module.exports = class User {
    static arrayFilter(ideas){
        ideaList = []
        const cloneIdeas = [...ideas]

        for(let i = 0; cloneIdeas[i] != undefined; i++){
            if(cloneIdeas[i].isAnonymously == false) {
                ideaList.push(cloneIdeas[i])
            } else {
                cloneIdeas[i].userId = {
                    fullName: "Anonymous",
                    _id: '',
                }
    
                ideaList.push(cloneIdeas[i])
            }
        }

        return ideaList
    }

    static singleFilter(idea){
        let newIdea
        let newComments = []
        for(let i = 0; idea.comments[i] != undefined; i++){
            if(idea.comments[i].commentId.isAnonymously == false) {
                newComments.push(idea.comments[i])
            } else {
                idea.comments[i].commentId.userId = {
                    fullName: "Anonymous",
                    _id: ' ',
                }
    
                newComments.push(idea.comments[i])
            }
        }

        if(idea.isAnonymously == true){
            newIdea = {
                _id: idea._id,
                title: idea.title,
                categoryId: idea.categoryId,
                description: idea.description,
                content: idea.content,
                userId: {
                    fullName: "Anonymous",
                    anonymously: {
                        "idea": false,
                        "comment": false
                    },
                    contact: {
                        "emails": [],
                        "phones": [],
                        "addresses": []
                    },
                    _id: "#",
                    roles: [],
                    department: {
                        departmentId: {
                            _id: '#',
                            name: "Anonymous"
                        }
                    }
                },
                submissionId: idea.submissionId,
                files: idea.files,
                isActive: idea.isActive,
                isAnonymously: idea.isAnonymously,
                comments: newComments,
                views: idea.views,
                reactions: idea.reactions,
                createdAt: idea.createdAt,
                updatedAt: idea.updatedAt
            }
            
            return newIdea
        }

        return idea
    }

    static get(){
        return ideaList
    }
}

