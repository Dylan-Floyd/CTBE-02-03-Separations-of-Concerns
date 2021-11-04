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
});
