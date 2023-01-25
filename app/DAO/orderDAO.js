import mongoose from 'mongoose';
import applicationException from '../service/applicationException';
import mongoConverter from '../service/mongoConverter';


const orderSchema = new mongoose.Schema({
    orderedProducts: {
            amount: Number,
            hint: String,
            name: String,
            productId: Number,
        },
    placementDate: String,
    totalPrice: String,
    email: String,
}, {
    collection: 'your-orders'
});

const OrderModel = mongoose.model('orders', orderSchema);


async function get() {
    const result = await OrderModel.find();
    if (result) {
        return result;
    }
  throw applicationException.new(applicationException.BAD_REQUEST, 'Could not find any orders');
}

async function getByUserEmail(email) {
    const result = await OrderModel.find({email: email});
    if (result) {
        return mongoConverter(result);
    }
    throw applicationException.new(applicationException.BAD_REQUEST, 'No orders for user with that email');
}

async function makeOrder(orderDetails) {
    const result = await OrderModel.create({
        orderedProducts: orderDetails.orderedProducts,
        placementDate: orderDetails.placementDate,
        totalPrice: orderDetails.totalPrice,
        email: orderDetails.email
    });
    if (result) {
        return mongoConverter(result);
    }
    throw applicationException.new(applicationException.BAD_REQUEST, 'No orders for user with that email');
}

async function deleteLastOrder() {
    return OrderModel.findOneAndDelete({}, {sort: {$natural: -1}})
}

async function deleteOrderById(orderId) {
    return OrderModel.findOneAndDelete({_id: orderId});
}

export default {
    get: get,
    getByUserEmail: getByUserEmail,
    makeOrder: makeOrder,
    deleteLastOrder: deleteLastOrder,
    deleteOrderById: deleteOrderById,
    model: OrderModel,
};
