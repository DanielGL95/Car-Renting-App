const mongoose = require('mongoose');
const Schama = mongoose.Schema;

const REQUIRED_VALIDATION_MESSAGE = 'Path "{PATH}" is required'


let carSchema =new Schama({
    make: {type:String, required:REQUIRED_VALIDATION_MESSAGE},
    model:{type:String, required:REQUIRED_VALIDATION_MESSAGE},
    year:{type:Number, required:REQUIRED_VALIDATION_MESSAGE},
    pricePerDay:{type:Number, required:REQUIRED_VALIDATION_MESSAGE},
    power:{type:Number},
    createdOn:{type:Date, default:Date.now()},
    isRented:{type:Boolean, default:false},
    image:{type:String, required:REQUIRED_VALIDATION_MESSAGE}
}) 

let Car = mongoose.model("Car", carSchema);
module.exports= Car;