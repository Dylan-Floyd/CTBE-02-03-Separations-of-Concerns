const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const Order = require('../lib/models/Order.js');

jest.mock('twilio', () => () => ({
  messages: {
    create: jest.fn()
  }
}));

describe('Order model tests', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('creates an Order instance from a row', () => {
    const row = {
      id: 1,
      quantity: 1
    };
    const order = new Order(row);
    expect(order).toEqual(row);
  });

  it('inserts a new order into the database and returns a new Order instance', async() => {
    const order = await Order.insert(2);
    const expected = {
      id: expect.any(String),
      quantity: 2
    };
    expect(order).toEqual(expected);
  });

  it('gets all orders from the db', async() => {
    const order1 = await Order.insert(2);
    const order2 = await Order.insert(3);
    const order3 = await Order.insert(4);

    const allOrders = await Order.getAll();
    expect(allOrders).toEqual(expect.arrayContaining([order1, order2, order3]));
  });

  it('gets an order by id', async() => {
    const expected = await Order.insert(2);

    const actual = await Order.getById(expected.id);
    expect(actual).toEqual(expected);
  });
});
