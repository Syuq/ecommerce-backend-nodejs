const ProductService = require('../services/product.service');
const { OK, CREATED, SuccessResponse } = require('../core/success.response');
class ProductController {
  createProduct = async (req, res, next) => {
    // new SuccessResponse({
    //     message:'Create new product Success',
    //     metadata: await ProductService.createProduct(req.body.product_type,{
    //         ...req.body,
    //         product_shop:req.user.UserId
    //     })
    // }).send(res)
    new SuccessResponse({
      message: 'Create new product Success',
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.UserId
      })
    }).send(res);
  };

  //update product
  updateProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Update product success',
      metadata: await ProductService.updateProduct(req.body.product_type, req.params.productId, {
        ...req.body,
        product_shop: req.user.UserId
      })
    }).send(res);
  };

  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'publishProductByShop Success',
      metadata: await ProductService.PublishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.UserId
      })
    }).send(res);
  };
  unpublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'unpublishProductByShop Success',
      metadata: await ProductService.unPublishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.UserId
      })
    }).send(res);
  };

  /// query ///
  /**
   * @desc get all Draf for shop
   * @param {Number} limit
   * @param {Number} skip
   * @return { JSON }
   */
  getAllDraftForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get List draft success!',
      metadata: await ProductService.findAllDraftForShop({
        product_shop: req.user.UserId
      })
    }).send(res);
  };

  /**
   * @desc get all publish for shop
   * @param {Number} limit
   * @param {Number} skip
   * @return { JSON }
   */
  getAllPublishForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get List publish success!',
      metadata: await ProductService.findAllPublishForShop({
        product_shop: req.user.UserId
      })
    }).send(res);
  };
  getListSearchProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get List search product success!',
      metadata: await ProductService.searchProduct(req.params)
    }).send(res);
  };
  findAllProducts = async (req, res, next) => {
    new SuccessResponse({
      message: 'Find all products !',
      metadata: await ProductService.findAllProduct(req.query)
    }).send(res);
  };

  findProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'findProduct  success !',
      metadata: await ProductService.findProduct({
        product_id: req.params.product_id
      })
    }).send(res);
  };
  /// end query ///
}

module.exports = new ProductController();
