const express = require('express')
const Favorite = require('../models/favorite')
const authenticate = require('../authenticate')
const cors = require('./cors')

const favoriteRouter = express.Router()

//* /favorites Endpoints
favoriteRouter
 .route('/')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.find({ user: req.user._id })
      .populate('user')
      .populate('campsites')
      .then(favorite => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'applilcation/json')
        res.json(favorite)
      })
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id }).then(favorite => {
      if (favorite) 
      {
        for(let x=0; x<req.body.length; x++)
        {
          if(!favorite.campsites.includes(req.body[x]))
          {
            favorite.campsites.push(req.body[x])
          }
        }
        favorite.save().then(fav => {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.json(fav)
        })
      } 
      else 
      {
        Favorite.create({ user: req.user._id })
          .then(favorite => {
            for(let x=0; x<req.body.length; x++)
                  {
                    if(!favorite.campsites.includes(req.body[x]))
                    {
                      favorite.campsites.push(req.body[x])
                    }
                  }
            favorite.save().then(fav => {
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.json(fav)
            })
          })
          .catch(err => next(err))
      }
    })
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403
    res.end(`PUT operation not supported on /favorites`)
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndDelete({ user: req.user._id })
      .then(response => {
        if (response) 
        {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.json(response)
        } 
        else 
        {
          res.setHeader('Content-Type', 'text/plain')
          res.end('You do not have any favorites to delete.')
        }
      })
      .catch(err => next(err))
  })


//* /favorites/campsiteID ENDPOINTS
  favoriteRouter
  .route('/:campsiteId')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403
    res.end(`Get operation not supported on /favorites`)
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    Favorite.findOne({ user: req.user._id }).then(favorite => {
      if (favorite) 
      {
        if (!favorite.campsites.includes(req.params.campsiteId)) 
        {
          favorite.campsites.push(req.params.campsiteId)
          favorite.save().then(fav => {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.json(fav)
        })
        }
        else
        {
          res.statusCode = 200
          res.setHeader('Content-Type', 'text/plain')
          res.end("That campsite is already in the list of favorites!")
        }
      } 
      else {
        Favorite.create({ user: req.user._id })
          .then(favorite => {
            if (!favorite.campsites.includes(req.params.campsiteId)) 
            {
              favorite.campsites.push(req.params.campsiteId)
            }
            favorite.save().then(fav => {
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.json(fav)
            })
          })
          .catch(err => next(err))
      }
    })
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403
    res.end(`PUT operation not supported on /favorites`)
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    Favorite.findOne({ user: req.user._id }).then(favorite => {
      if (favorite) 
      {
        const index = favorite.campsites.indexOf(req.params.campsiteId)
        if (index >= 0) 
        {
          favorite.campsites.splice(index, 1)
        }
        favorite.save().then(fav => {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.json(fav)
        })
      } 
      else 
      {
        res.statusCode = 200
        res.setHeader('Content-Type', 'text/plain')
        res.end('there are no favorites to delete')
      }
    })
  })  
module.exports = favoriteRouter;
