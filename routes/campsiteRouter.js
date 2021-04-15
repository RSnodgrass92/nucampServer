const express = require("express")
const Campsite = require("../models/campsite")

const campsiteRouter = express.Router()

campsiteRouter.route("/")

//* ENDPOINTS

.get((req,res, next)=>{
   
    Campsite.find()
    .then(campsites=>{
        res.statusCode=200
        res.setHeader("Content-Type","application/json")
        //res.json will send this information to the client no need to use res.end
        res.json(campsites)
    })
    //this allows express to handle the error if there is one
    .catch(err => next(err))
})

.post((req,res, next)=>
{
    //mongoose will already check this to make sure it matches the schema we defined
    Campsite.create(req.body)
    .then(campsite=>{
        console.log("Campsite Created", campsite);
        res.statusCode= 200
        res.setHeader("Content-Type", "application/json")
        res.json(campsite)
    })
    .catch(err => next(err))
})

//we can leave this as is because put is not an allowed operation on /campsites
.put((req,res)=>{
    res.statusCode = 403; 
    res.end("PUT operation not supported on /campsites")
})

.delete((req,res, next)=>{
    Campsite.deleteMany()
    .then(response => {
        res.statusCode= 200
        res.setHeader("Content-Type", "application/json")
        res.json(response)
    })
    .catch(err => next(err))
})

campsiteRouter.route(`/:campsiteId`)

.get((req,res, next)=>{
    Campsite.findById(req.params.campsiteId)
    .then(campsite=>{
        console.log("Campsite Created", campsite);
        res.statusCode= 200
        res.setHeader("Content-Type", "application/json")
        res.json(campsite)
    })
    .catch(err => next(err))
})

.post((req,res)=>
{
    res.end(`POST operation not supported on /campsites/${req.params.campsiteId}`)
})

.put((req,res, next)=>{
    Campsite.findByIdAndUpdate(req.params.campsiteId, {$set: req.body}, {new: true})
    .then(campsite =>{
        res.statusCode = 200
        res.setHeader("Content-Type", "application/json")
        res.json(campsite)
    }) 
    .catch(err => next(err))
})

.delete((req,res, next)=>{
    Campsite.findByIdAndDelete(req.params.campsiteId)
    .then(response =>{
        res.statusCode = 200
        res.setHeader("Content-Type", "application/json")
        res.json(response)
    }) 
    .catch(err => next(err))
})

module.exports = campsiteRouter