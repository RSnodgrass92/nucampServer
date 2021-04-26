const express = require("express")
const Partner = require("../models/partner")
const authenticate = require("../authenticate")
const cors = require("./cors")

const partnerRouter = express.Router()

partnerRouter.route("/")

//* ENDPOINTS
.options(cors.corsWithOptions,(req,res)=> res.sendStatus(200))
.get(cors.cors,(req,res, next)=>{
   
    Partner.find()
    .then(partners=>{
        res.statusCode=200
        res.setHeader("Content-Type","application/json")
        //res.json will send this information to the client no need to use res.end
        res.json(partners)
    })
    //this allows express to handle the error if there is one
    .catch(err => next(err))
})

.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res, next)=>
{
    //mongoose will already check this to make sure it matches the schema we defined
    Partner.create(req.body)
    .then(partner=>{
        console.log("partner Created", partner);
        res.statusCode= 200
        res.setHeader("Content-Type", "application/json")
        res.json(partner)
    })
    .catch(err => next(err))
})

//we can leave this as is because put is not an allowed operation on /partners
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res)=>{
    res.statusCode = 403; 
    res.end("PUT operation not supported on /partners")
})

.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res, next)=>{
    Partner.deleteMany()
    .then(response => {
        res.statusCode= 200
        res.setHeader("Content-Type", "application/json")
        res.json(response)
    })
    .catch(err => next(err))
})

partnerRouter.route(`/:partnerId`)
.options(cors.corsWithOptions,(req,res)=> res.sendStatus(200))
.get(cors.cors,(req,res, next)=>{
    Partner.findById(req.params.partnerId)
    .then(partner=>{
        console.log("partner Created", partner);
        res.statusCode= 200
        res.setHeader("Content-Type", "application/json")
        res.json(partner)
    })
    .catch(err => next(err))
})

.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res)=>
{
    res.statusCode= 403
    res.end(`POST operation not supported on /partners/${req.params.partnerId}`)
})

.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res, next)=>{
    Partner.findByIdAndUpdate(req.params.partnerId, {$set: req.body}, {new: true})
    .then(partner =>{
        res.statusCode = 200
        res.setHeader("Content-Type", "application/json")
        res.json(partner)
    }) 
    .catch(err => next(err))
})

.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res, next)=>{
    Partner.findByIdAndDelete(req.params.partnerId)
    .then(response =>{
        res.statusCode = 200
        res.setHeader("Content-Type", "application/json")
        res.json(response)
    }) 
    .catch(err => next(err))
})

module.exports = partnerRouter