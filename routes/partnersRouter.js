const express = require("express")
const partnersRouter = express.Router()

partnersRouter.route("/")

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
    res.end("Will send all the partners to you")
})

.post((req,res)=>
{
    res.end(`Will add the partners: ${req.body.name} with description: ${req.body.description}`)
})

.put((req,res)=>{
    res.statusCode = 403; 
    res.end("PUT operation not supported on /partners")
})

.delete((req,res)=>{
    res.end("Deleting all partners")
})

partnersRouter.route(`/:partnersId`)

.all((req,res,next)=> 
{
    res.statusCode= 200
    res.header("Content-Type", "text/plain")
    next()
})
.get((req,res)=>{
    res.end(`Will send details of the partners: ${req.params.partnersId}`)
})

.post((req,res)=>
{
    res.end(`POST operation not supported on /partners/${req.params.partnersId}`)
})

.put((req,res)=>{
    res.write(`Updating the partners: ${req.params.partnersId}\n`)
    res.end(`Will update the partners: ${req.body.name} 
            with description: ${req.body.description}`)
})

.delete((req,res)=>{
    res.end(`Deleting partners: ${req.params.partnersId}`)
})

module.exports = partnersRouter