const jwt = require('jsonwebtoken')
 
const verifyToken = (req, res, next) => {
    //const  accessToken = req.header('Auth-Access-Token')
    const  accessToken = req.cookies.token
    if (!accessToken)  {
        req.user = null
        next()
        return
    }

    try {
        const verified = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
        req.user = verified
        next()
        return
    } catch (error) {
        res.status(400).send({ message: "Invalid Token!" })
    }
}

const isAdmin = (req, res, next) => {
    try{
        for(let i = 0; req.user.roles[i] != undefined; i++){
            if(req.user.roles[i] == "Admin" || req.user.roles[i] == "QA manager") {
                next()
                return;
            }
        }
        res.status(403).send({ message: "Require Admin Role!" });
        return;
    } catch (err){
        res.status(400).send({ message: "Invalid Token!", err })
    }
}

const isQAManager = (req, res, next) => {
    try{
        for(let i = 0; req.user.roles[i] != undefined; i++){
            if(req.user.roles[i] == "QA manager") {
                next()
                return;
            }
        }
        res.status(403).send({ message: "Require QA Manager Role!" });
        return;
    } catch (err){
        res.status(400).send({ message: "Invalid Token!", err })
    }
}

const verifyAuth = {
    verifyToken,
    isAdmin,
    isQAManager
}

module.exports = verifyAuth