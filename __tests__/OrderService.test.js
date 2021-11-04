const twilioUtil = require('../lib/utils/twilio.js');
twilioUtil.sendSms = jest.fn();

const Order = require('../lib/models/Order.js');
const { updateOrder } = require('../lib/services/OrderService.js');
const setup = require('../data/setup.js');
const pool = require('../lib/utils/pool.js');

describe('OrderService tests', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('updates an order quantity and sends an SMS', async() => {
    const initialOrder = await Order.insert(10);
    const expected = new Order({
      id: initialOrder.id,
      quantity: 42
    });
    const actual = await updateOrder(initialOrder.id, 42);
    expect(actual).toEqual(expected);
    expect(twilioUtil.sendSms).toHaveBeenCalled();
  });
});
