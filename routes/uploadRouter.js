const express= require('express')
const authenticate= require("../authenticate")
const multer = require('multer')
const cors = require("./cors")


//* Multer Set up 
const storage= multer.diskStorage({
    destination:(req, file, cb)=>
    {
        cb(null, 'public/images')
    }, 
    filename:(req,file,cb)=>
    {
        //file.originalname makes sure the name of the file on the server is the same as the name of the file on the client side, by default multer will assign a random string instead
        cb(null, file.originalname)
    }
})

// this makes sure ONLY image files will be uploaded
const imageFileFilter = (req,file,cb) => 
{
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/))
    {
        //the false arg tells multer to reject this submission
        return cb(new Error("You can upload only image files!"), false)
    }
    //null in the cb tells multer there is no error
    cb(null, true)
}

const upload = multer({storage:storage, fileFilter: imageFileFilter})
//*


//& Set up upload router

const uploadRouter = express.Router()

uploadRouter.route('/')
.options(cors.corsWithOptions,(req,res)=> res.sendStatus(200))
.get(cors.cors,authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /imageUpload');
})

.post(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(req.file);
})

.put(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /imageUpload');
})

.delete(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /imageUpload');
});


//&
module.exports= uploadRouter