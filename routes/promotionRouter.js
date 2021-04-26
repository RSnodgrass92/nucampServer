const express = require("express")
const Promotion = require("../models/promotion")
const authenticate = require("../authenticate")
const cors = require("./cors")

const promotionRouter = express.Router()

promotionRouter.route("/")

//* ENDPOINTS
.options(cors.corsWithOptions,(req,res)=> res.sendStatus(200))
.get(cors.cors,(req,res, next)=>{
   
    Promotion.find()
    .then(promotions=>{
        res.statusCode=200
        res.setHeader("Content-Type","application/json")
        //res.json will send this information to the client no need to use res.end
        res.json(promotions)
    })
    //this allows express to handle the error if there is one
    .catch(err => next(err))
})

.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res, next)=>
{
    //mongoose will already check this to make sure it matches the schema we defined
    Promotion.create(req.body)
    .then(promotion=>{
        console.log("promotion Created", promotion);
        res.statusCode= 200
        res.setHeader("Content-Type", "application/json")
        res.json(promotion)
    })
    .catch(err => next(err))
})

//we can leave this as is because put is not an allowed operation on /promotions
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res)=>{
    res.statusCode = 403; 
    res.end("PUT operation not supported on /promotions")
})

.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res, next)=>{
    Promotion.deleteMany()
    .then(response => {
        res.statusCode= 200
        res.setHeader("Content-Type", "application/json")
        res.json(response)
    })
    .catch(err => next(err))
})

promotionRouter.route(`/:promotionId`)

.options(cors.corsWithOptions,(req,res)=> res.sendStatus(200))
.get(cors.cors,(req,res, next)=>{
    Promotion.findById(req.params.promotionId)
    .then(promotion=>{
        console.log("promotion Created", promotion);
        res.statusCode= 200
        res.setHeader("Content-Type", "application/json")
        res.json(promotion)
    })
    .catch(err => next(err))
})

.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res)=>
{
    res.statusCode= 403
    res.end(`POST operation not supported on /promotions/${req.params.promotionId}`)
})

.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res, next)=>{
    Promotion.findByIdAndUpdate(req.params.promotionId, {$set: req.body}, {new: true})
    .then(promotion =>{
        res.statusCode = 200
        res.setHeader("Content-Type", "application/json")
        res.json(promotion)
    }) 
    .catch(err => next(err))
})

.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res, next)=>{
    Promotion.findByIdAndDelete(req.params.promotionId)
    .then(response =>{
        res.statusCode = 200
        res.setHeader("Content-Type", "application/json")
        res.json(response)
    }) 
    .catch(err => next(err))
})

module.exports = promotionRouter