const mongoose = require("mongoose")
//setting up a shorthand for accessing mongoose.Schema this is not absolutely necessary 
const Schema = mongoose.Schema

//this will bring in the currency type provided by mongoose-currency to be accessed in mongoose
require("mongoose-currency").loadType(mongoose)
const Currency = mongoose.Types.Currency


const commentSchema= new Schema({
    rating:{
        type: Number, 
        min: 1, 
        max: 5,
        required: true
    }, 
    text: {
        type: String, 
        required: true, 
    },
    author:{
        type: String, 
        required: true,
    }
}, 
{
    timestamps: true
}
)


//* Create Schema
//the first argument for schema is an object that defines the schemas properties. The second arg
//is used for setting configuration options
const campsiteSchema = new Schema(
{
    name:
        {
            type: String,
            required: true, 
            //no two docs in this collection should have the same name field
            unique: true,
        },

    description:
        {
            type: String, 
            required: true
        }, 
    //comment Schema will be a sub schema in this collection
    image: 
        {
            type: String, 
            required: true
        }, 
    elevation: 
        {
            type: Number, 
            required: true
        }, 
    cost: 
        {
            type: Currency,
            required: true,
            min: 0
        },
    featured: 
        {
            type: Boolean,
            default: false
        },
    comments: [commentSchema]
}, 
{ 
    timestamps: true,
}
)

//* Create model from a schema

//mongoose.model returns a constructor function
const Campsite= mongoose.model("Campsite", campsiteSchema)

module.exports = Campsite