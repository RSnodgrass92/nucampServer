const mongoose = require("mongoose")
//setting up a shorthand for accessing mongoose.Schema this is not absolutely necessary 
const Schema = mongoose.Schema

const favoriteSchema= new Schema({
    
    user:{
        type: mongoose.Schema.Types.ObjectId, 
        ref:"User"
    }, 

    campsites: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref:"Campsite"
    }],
   
}, 
{
    timestamps: true
}
)


//* Create model from a schema

//mongoose.model returns a constructor function
const Favorite= mongoose.model("Favorite", favoriteSchema)

module.exports = Favorite