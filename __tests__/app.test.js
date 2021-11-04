const pool = require('../lib/utils/pool');
//const twilio = require('twilio');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

jest.mock('twilio', () => () => ({
  messages: {
    create: jest.fn()
  }
}));

describe('02-03-separation-of-concerns routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  const makePostOrderPromise = () => new Promise((resolve, reject) => {
    request(app)
      .post('/api/v1/orders')
      .send({ quantity: 10 })
      .then(res => resolve(res.body))
      .catch(e => reject(e));
  });

  it('creates a new order in our database and sends a text message', async() => {
    expect.assertions(1);

    const res = await request(app)
      .post('/api/v1/orders')
      .send({ quantity: 10 });
    
    expect(res.body).toEqual({
      id: '1',
      quantity: 10
    });
  });

  it('gets an order by id', async() => {
    const res = await request(app)
      .post('/api/v1/orders')
      .send({ quantity: 10 });

    const order = res.body;

    const gottenOrder = await request(app)
      .get(`/api/v1/orders/${order.id}`);

    expect(gottenOrder.body).toEqual(order);
  });

  it('gets all orders', async() => {
    const promises = [
      makePostOrderPromise(),
      makePostOrderPromise(),
      makePostOrderPromise()
    ];
    const allOrders = await Promise.all(promises);
    const { body } = await request(app)
      .get('/api/v1/orders/');

    expect(body).toEqual(expect.arrayContaining(allOrders));
    expect(body.length).toEqual(allOrders.length);
  });

  it('updates an order by id', async() => {
    const initial = await makePostOrderPromise();
    const expected = {
      id: initial.id,
      quantity: 42
    };
    const { body: actual } = await request(app)
      .patch(`/api/v1/orders/${initial.id}`)
      .send({ quantity: 42 });
    expect(actual).toEqual(expected);
  });

  it('deletes an order by id', async() => {
    const order = await makePostOrderPromise();
    const { status } = await request(app)
      .delete(`/api/v1/orders/${order.id}`);
    expect(status).toEqual(204);

    const { body: allOrders } = await request(app)
      .get('/api/v1/orders/');
    expect(allOrders).toEqual([]);
  });
});
