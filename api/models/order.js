const mongoose = require('mongoose');
const orderSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    productID : { type : String, required : true },
    qty : { type : Number, default : 1 }
});
module.exports = mongoose.model('Order', orderSchema);