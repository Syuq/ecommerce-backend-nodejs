const express =require('express')
const ProductController =require('../../controller/product.controller')
const route= express.Router();
const asyncHandler = require('../../helpers/asyncHandler');
const { authenticationV2 } = require('../../auth/authUtils');

route.get('/search/:keySearch',asyncHandler(ProductController.getListSearchProduct))
route.get('',asyncHandler(ProductController.findAllProducts))
route.get('/:product_id',asyncHandler(ProductController.findProduct))

//authentication///
route.use(authenticationV2)
///////////
route.post('',asyncHandler(ProductController.createProduct))
route.patch('/:productId',asyncHandler(ProductController.updateProduct))

route.post('/publish/:id',asyncHandler(ProductController.publishProductbyShop))
route.post('/unpublish/:id',asyncHandler(ProductController.unpublishProductbyShop))

// QUERY //
/**
 * This is get all products for shop, not unregistered user so must go through authentication step to verify token
 */
route.get('/draf/all',asyncHandler(ProductController.getAllDrafForShop))
route.get('/published/all',asyncHandler(ProductController.getAllPublishForShop))

module.exports=route