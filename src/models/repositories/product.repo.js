const {product,electronic,furniture,clothing} = require("../../models/product.model")
const {Types} = require("mongoose")
const {getSelectData,getUnSelectData, convertToObjectIdMongoDb} = require("../../utils/index")
const { findByIdAndUpdate } = require("../keytoken.model")
const findAllDraftForShop = async({query,limit,skip})=>{
    return await queryProduct({query,limit,skip})

}
const findAllPublishForShop = async({query,limit,skip})=>{
    return await queryProduct({query,limit,skip})

}
const searchProductByuser = async ({keySearch})=>{
    const regexSearch = new RegExp(keySearch)
    const results = await product.find({
        isPublish:true,
        $text:{$search:regexSearch}},
        {score:{$meta:'textScore'}})
        .sort({score:{$meta:'textScore'}}).lean()
    return results

}

const PublishProductByshop = async({product_shop,product_id})=>{
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })
    if(!foundShop)
    {
        return null
    }

    foundShop.isDraft = false
    foundShop.isPublish = true
    const {modifiedCount} = await foundShop.updateOne(foundShop)
    return modifiedCount
}
const unPublishProductByshop = async({product_shop,product_id})=>{
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })
    if(!foundShop)
    {
        return null
    }

    foundShop.isDraft = true
    foundShop.isPublish = false
    const {modifiedCount} = await foundShop.updateOne(foundShop)
    return modifiedCount
}

const findAllProduct = async ({limit ,sort,page,filter,select})=>{
    const skip =(page-1)*limit
    const sortBy = sort === 'ctime' ?{_id:-1}:{_id:1}
    const products = await product.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()
    
    return products
}

const queryProduct =async({query,limit ,skip})=>{
    return await product.find(query)
    .populate('product_shop','name email -_id')
    .sort({updateAt:-1})
    .skip(skip)
    .limit(limit)
    .lean()
    .exec()
}
const findProduct = async ({product_id,unSelect})=>{
    return await product.findById(product_id).select(getUnSelectData(unSelect))
}

const updateProductById = async({
    productId,
    bodyUpdate,
    model,
    isNew = true
})=>{
    return await model.findByIdAndUpdate(productId,bodyUpdate,{new:isNew})
}

const getProductByid = async(productId)=>{
    return await product.findOne({_id:convertToObjectIdMongoDb(productId)}).lean()
}

const checkProductBySever = async(products)=>{
    return await Promise.all(products.map(async product =>{
        const foundProduct = await getProductByid(product.productId)
        if(foundProduct)
        {
            return {
                price:foundProduct.product_price,
                quantity:product.quantity,
                productId:product.productId
            }
        }
    }))
}

module.exports={
    findAllDraftForShop,
    PublishProductByshop,
    findAllPublishForShop,
    unPublishProductByshop,
    searchProductByuser,
    findAllProduct,
    findProduct,
    updateProductById,
    getProductByid,
    checkProductBySever
}