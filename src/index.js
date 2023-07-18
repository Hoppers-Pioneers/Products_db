const { Pool } = require('pg');
const Config = require('../config');
const express = require('express');
const router = express.Router();
const ctrl = require('./controllers');

const pool = new Pool({
  user: 'postgres',
  password: Config.POSTGRES_PASSWORD,
  host: '127.0.0.1',
  database: 'products',
  port: 5432
});

const app = express();
const port = 3001;

app.use('/', router);

router.get('/', (req, res) => {
  console.log('ALL GOOD TO GO!');
});

router.get('/products', async (req, res) => {
  try {
    const products = await ctrl.getProducts();
    res.json(products);
  } catch (err) {
    res.status(500).send('Error fetching products');
  }
});

router.get('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ctrl.getProduct(id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).send('Product not found');
    }
  } catch (err) {
    res.status(500).send('Error fetching product');
  }
});


router.get('/products/:product_id/styles', async (req, res) => {
  try {
    const { product_id } = req.params;
    const styles = await ctrl.getStyles(product_id);
    res.json(styles);
  } catch (err) {
    res.status(500).send('Error fetching styles');
  }
});

router.get('/products/:product_id/related', async (req, res) => {
  try {
    const { product_id } = req.params;
    const relatedProducts = await ctrl.getRelated(product_id);
    res.json(relatedProducts);
  } catch (err) {
    res.status(500).send('Error fetching related');
  }
});

const server = app.listen(port, () => {
  console.log(`Currently listening on port ${port}`);
});

module.exports = server;