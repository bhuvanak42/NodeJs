const Product = require('../models/product'); 
const mongoose = require('mongoose');

exports.getAll = (req, res, next) => {
	Product.find().select("_id name price productImage").exec()
	.then(docs => {
		if(docs.length){
			const response = {
				count : docs.length,
				products : docs.map(doc => {
					return {
						name : doc.name,
						price : doc.price,
						_id : doc._id,
						productImage : doc.productImage,
						request : {
							type : 'GET',
							url : `http://localhost:3001/products/${doc._id}`
						}
					}
				})
			};
			res.status(200).json(response);
		}
		else{
			res.status(409).json({
				message: "Products not found"
			});
		}
	})
	.catch(err => {
		res.status(500).json({
			error : err
		});
	})
};

exports.postProduct =  (req, res, next) => {
	console.log("hello");
	console.log(req.body.name + "  " + req.body.price + "  " + req.file  );
	const product = new Product({
		_id : new mongoose.Types.ObjectId(),
		name : req.body.name,
		price: req.body.price,
		productImage : req.file.destination+req.file.filename
	});

	product.save().then(result => {
		console.log("Product created");
		res.status(201).json({
			product : {
				name: product.name,
				price : product.price,
				_id : product._id,
				productImage : product.productImage,
				response : {
					type : 'GET',
					url : `http://localhost:3001/products/${result._id}`
				}
			},
			message : `Product created successfully`
		});
	}).catch( err => {
		console.log(err);
		res.status(500).json({
			error : err
		});
	} );
};

exports.getProduct =  (req, res, next) => {
	console.log(process.env.PORT);
	const product = Product.findById(req.params.id).select("_id name price productImage").exec()
	.then(doc => {
		if(doc){
			const response = {
				name : doc.name,
				price : doc.price,
				_id : doc._id,
				productImage : doc.productImage,
				response : {
					type : 'GET',
					url : `http://localhost:3001/products/`
				}
			}
			res.status(200).json(response);
		}
		else{
			res.status(409).json({
				message : 'Product not found'
			});
		}
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			error : err
		});
	});
};

exports.updateProduct = (req, res, next) => {
	Product.updateOne({ _id : req.params.id } , { $set : { name : req.body.name, price : req.body.price } }).exec()
	.then(result => {
		res.status(200).json({
			message : "Product updated successfully",
			result : result,
			response : {
				type : 'GET',
				url : `http://localhost:3001/products/${req.params.id}`
			}
		});
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			error : err
		});
	});
};

exports.deleteProduct = (req, res, next) => {
	Product.deleteOne({ _id : req.params.id }).exec()
	.then(result => {
		res.status(200).json({
			message: "Product deleted",
			response : {
				type : 'POST',
				url : `http://localhost:3001/products/`,
				data : { name : 'String', price : 'Number' }
			}
		});
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			error : err
		});
	});
};