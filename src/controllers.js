const { Pool } = require('pg');
const Config = require('../config');

const pool = new Pool({
  user: 'postgres',
  password: Config.POSTGRES_PASSWORD,
  host: '127.0.0.1',
  database: 'products',
  port: 5432
});

// Function to get all products from the database
async function getProducts(page, count) {
  try {
    const client = await pool.connect();
    const query = 'SELECT * FROM products';
    const result = await client.query(query);
    client.release();
    return result.rows;
  } catch (err) {
    throw err;
  }
}

// Function to get a single product by ID from the database
async function getProduct(id) {
  try {
    const client = await pool.connect();
    const query = 'SELECT * FROM products WHERE id = $1';
    const result = await client.query(query, [id]);
    client.release();
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (err) {
    throw err;
  }
}

// Function to get product styles by product ID from the database
async function getStyles(product_id) {
  try {
    const client = await pool.connect();
    const query = 'SELECT * FROM styles WHERE product_id = $1';
    const result = await client.query(query, [product_id]);
    client.release();
    return result.rows;
  } catch (err) {
    throw err;
  }
}

// Function to get related products by product ID from the database
async function getRelated(product_id) {
  try {
    const client = await pool.connect();
    const query = 'SELECT unnest(related_product_id) AS related_product_id FROM related WHERE current_product_id = $1';
    const result = await client.query(query, [product_id]);
    client.release();

    const relatedProductIds = result.rows.length > 0 ? result.rows[0].related_product_id : [];

    return relatedProductIds;
  } catch (err) {
    throw err;
  }
}


module.exports = {
  getProducts,
  getProduct,
  getStyles,
  getRelated
};


