const express = require('express');
const router = express.Router();

const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const ProductController = require('../controllers/products');

const fileName = new Date().toISOString().replace(/:/g, "_").replace(/\./g, "_");
const storage = multer.diskStorage({
	destination : function(req, file, cb){
		cb(null, 'uploads/');
	},
	filename: function(req, file, cb){
		cb(null, fileName + "_" + file.originalname);
	}
});

const filefilter = (req, file, cb) => {
if(file.mimetype === 'image/jpeg'){
		cb(null, true);
	}
	else{
		cb(null, false);
	}
};

const uploads = multer({
	storage : storage,
	limits : {
		fileSize : 1024 * 1024 * 5
	},
	fileFilter : filefilter
});

router.get('/', ProductController.getAll);

router.post('/', checkAuth, uploads.single('productImage') , ProductController.postProduct);

router.get('/:id', ProductController.getProduct);

router.patch('/:id', checkAuth, ProductController.updateProduct);

router.delete('/:id', checkAuth, ProductController.deleteProduct);

module.exports = router;