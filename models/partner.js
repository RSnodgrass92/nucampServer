const mongoose = require("mongoose")
//setting up a shorthand for accessing mongoose.Schema this is not absolutely necessary 
const Schema = mongoose.Schema

const partnerSchema= new Schema({
    name:{
        type: String, 
        unique: true, 
        required: true
    }, 
    image: {
        type: String, 
        required: true, 
    },
    featured:{
        type: Boolean, 
    }, 
    description:{
        type: String, 
        required: true
    }
}, 
{
    timestamps: true
}
)


//* Create model from a schema

//mongoose.model returns a constructor function
const Partner= mongoose.model("Partner", partnerSchema)

module.exports = Partner