const mongoose = require('mongoose');
const Order = require('../models/order');

exports.getAll = (req, res, next) => { 
	Order.find().select('_id productID qty').exec()
	.then( docs => {
		if(docs.length){
			const response = {
				count : docs.length,
				orders : docs.map(doc => {
					return {
						_id : doc._id,
						productID : doc.productID,
						qty : doc.qty,
						request : {
							type : 'GET',
							url : `http://localhost:3001/orders/${doc._id}`
						}
					}
				})
			};
			res.status(200).json(response);
		}
		else{
			res.status(409).json({
				message : 'Orders not available'
			});
		}
	} )
	.catch(err => {
		console.log(err);
		res.status(500).json(err);
	});
 };
exports.getOne =  (req, res, next) => {
	Order.findById(req.params.id).select("_id productID qty").exec()
	.then(doc => {
		if(doc){
			const response = {
				_id : doc._id,
				productID : doc.productID,
				qty : doc.qty,
				request : {
					type : 'GET',
					url : `http://localhost:3001/orders/`
				}
			};
			res.status(200).json(response);
		}
		else{
			req.status(409).json({
				message : "Orders list not available"
			})
		}
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			error : err
		});
	});
};
exports.update = (req, res, next) => {
	Order.update({ _id : req.params.id } , { $set : { productID : req.body.productID, qty : req.body.qty } }).exec()
	.then( result => {
		res.status(200).json({
			message: "Order updated successfully",
			order : {
				_id : req.params.id,
				productID : req.body.productID, 
				qty : req.body.qty,
				request : {
					type : 'GET',
					url : `http://localhost:3001/orders/${req.params.id}`
				}
			}
		});
	})
	.catch(err => {
		res.status(500).json({
			error : err
		});
	});
};
exports.post = (req, res, next) => {
	const order = new Order({
		_id : new mongoose.Types.ObjectId(),
		productID : req.body.productID,
		qty : req.body.qty
	});
	order.save()
	.then(result => {
		res.status(201).json({
			message : "Order created sucessfully",
			order : {
				_id : order._id,
				productID : order.productID,
				qty : order.qty,
				request : {
					type : 'GET',
					url : `http://localhost:3001/orders/${order._id}`
				}
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