'use strict';

import userManager from './user.manager';
import orderManager from './order.manager';
import productManager from './product.manager';


function getter(manager, request) {
  return function () {
    return manager.create(request, this);
  };
}

export default {
    getUserManager: getter(userManager),
    getOrderManager: getter(orderManager),
    getProductManager: getter(productManager)
};
