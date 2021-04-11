const express = require("express")
const promotionRouter = express.Router()

promotionRouter.route("/")

//* ENDPOINTS
//.all is a catch all for all http verbs use this to set default props for all routing methods
  .all((req,res,next)=> 
{
    res.statusCode= 200
    //indicates we are going to send plain text in the response body
    res.header("Content-Type", "text/plain")
    //sends to the next relevant routing method, if not included would just stop here
    next()
})

.get((req,res)=>{
    res.end("Will send all the promotions to you")
})

.post((req,res)=>
{
    res.end(`Will add the promotion: ${req.body.name} with description: ${req.body.description}`)
})

.put((req,res)=>{
    res.statusCode = 403; 
    res.end("PUT operation not supported on /promotions")
})

.delete((req,res)=>{
    res.end("Deleting all promotions")
})

promotionRouter.route(`/:promotionId`)

.all((req,res,next)=> 
{
    res.statusCode= 200
    res.header("Content-Type", "text/plain")
    next()
})
.get((req,res)=>{
    res.end(`Will send details of the promotion: ${req.params.promotionId}`)
})

.post((req,res)=>
{
    res.end(`POST operation not supported on /promotions/${req.params.promotionId}`)
})

.put((req,res)=>{
    res.write(`Updating the promotion: ${req.params.promotionId}\n`)
    res.end(`Will update the promotion: ${req.body.name} 
            with description: ${req.body.description}`)
})

.delete((req,res)=>{
    res.end(`Deleting promotion: ${req.params.promotionId}`)
})

module.exports = promotionRouter