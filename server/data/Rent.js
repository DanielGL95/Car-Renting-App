const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const Schema = mongoose.Schema;

let rentSchema = new Schema({
    user:{type:ObjectId, required:true, ref:'User'},
    car:{type:ObjectId, required:true, ref:"Car"},
    days:{type:Number, required:true},
    totalPrice: {type:Number, required:true}
})

let Rent = mongoose.model('Rent',rentSchema);
module.exports = Rent;