const pool = require('../utils/pool');

// static method: JSON.parse(), JSON.stringify(), Math.random()
// instance method: .toUpperCase(), .map/.reduce/.filter/.find/.some/.every
module.exports = class Order {
  id;
  quantity;

  constructor(row) {
    this.id = row.id;
    this.quantity = row.quantity;
  }

  static async insert(quantity) {
    const { rows } = await pool.query(
      'INSERT INTO orders (quantity) VALUES ($1) RETURNING *',
      [quantity]
    );

    return new Order(rows[0]);
  }

  static async getAll() {
    const { rows } = await pool.query(
      'SELECT * FROM orders'
    );

    return rows.map(row => new Order(row));
  }

  static async getById(id) {
    const { rows } = await pool.query(
      `SELECT * FROM orders
      WHERE id=$1`,
      [id]
    );
    return new Order(rows[0]);
  }

  static async update(id, quantity) {
    const { rows } = await pool.query(
      `UPDATE orders SET quantity=$1
      WHERE id=$2
      RETURNING *`,
      [quantity, id]
    );

    return new Order(rows[0]);
  }
};
