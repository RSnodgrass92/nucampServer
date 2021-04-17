const mongoose = require("mongoose")
//setting up a shorthand for accessing mongoose.Schema this is not absolutely necessary 
const Schema = mongoose.Schema

require("mongoose-currency").loadType(mongoose)
const Currency = mongoose.Types.Currency


const promotionSchema= new Schema({
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
    cost:{
        type:Currency, 
        required: true, 
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
const Promotion= mongoose.model("Promotion", promotionSchema)

module.exports = Promotion