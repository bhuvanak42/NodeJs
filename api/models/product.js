const mongoose = require('mongoose');
const productSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    name : { type : String, required : true },
    price : { type : Number, requied : true },
    productImage : { type : String, requied : true }
});

module.exports = mongoose.model('Product', productSchema);