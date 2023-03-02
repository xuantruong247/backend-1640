const uuid = require('uuid').v4;
const multer  = require('multer')
const fs = require('fs')
 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const submissionId = req.params.id
        const dir = `./public/uploads/${submissionId}`
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        cb(null, dir)
    },
    filename: (req, file, cb) => {
        const { originalname } = file;
        cb(null, `${uuid()}-${originalname}`);
    }
})
   
var upload = multer({ storage })

module.exports = upload