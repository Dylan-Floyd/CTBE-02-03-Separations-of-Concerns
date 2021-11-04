jest.mock('twilio', () => () => ({
  messages: {
    create: jest.fn()
  }
}));

describe('OrderService tests', () => {

  it('', () => {
    expect(true).toEqual(true);
  });
});
