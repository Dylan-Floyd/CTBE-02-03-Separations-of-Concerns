const Order = require('../models/Order');
const { sendSms } = require('../utils/twilio');

module.exports = class OrderService {
  static async createOrder(quantity) {
    await sendSms(
      process.env.ORDER_HANDLER_NUMBER,
      `New Order received for ${quantity}`
    );

    const order = await Order.insert(quantity);

    return order;
  }

  static async updateOrder(id, quantity) {
    const updatedOrder = await Order.update(id, quantity);

    await sendSms(
      process.env.ORDER_HANDLER_NUMBER,
      `Order (${id}) updated to quantity: ${quantity}`
    );

    return updatedOrder;
  }

  static async deleteOrder(id) {
    await Order.delete(id);

    await sendSms(
      process.env.ORDER_HANDLER_NUMBER,
      `Order (${id}) has been deleted`
    );
  }
};
