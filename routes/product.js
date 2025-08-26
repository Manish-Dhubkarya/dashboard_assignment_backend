var express = require('express');
var router = express.Router();
var pool = require('./pool');
var upload = require('./multer');

router.post('/submit_product', upload.single('picture'), function (req, res) {
  try {
    const { productname, description, price, categoryid } = req.body;
    pool.query(
      'INSERT INTO product (productname, description, price, categoryid, picture) VALUES (?, ?, ?, ?, ?)',
      [productname, description, price, categoryid, req.file.filename],
      function (error, result) {
        if (error) {
          console.error('Database error:', error);
          return res.status(500).json({ status: false, message: 'Database Error!' });
        }
        res.status(200).json({ status: true, message: 'Product submitted successfully!' });
      }
    );
  } catch (e) {
    console.error('Error:', e);
    res.status(400).json({ status: false, message: 'Server error!' });
  }
});

router.get('/display_all_products', function (req, res) {
  try {
    pool.query(
      'SELECT P.*, (SELECT C.categoryname FROM category C WHERE C.categoryid = P.categoryid) AS categoryname FROM product P',
      function (error, result) {
        if (error) {
          console.error('Database error:', error);
          res.status(500).json({ status: false, message: 'Database error!' });
        } else {
          res.status(200).json({ data: result, status: true, message: 'Success!' });
        }
      }
    );
  } catch (e) {
    console.error('Error:', e);
    res.status(400).json({ status: false, message: 'Connection error!' });
  }
});

module.exports = router;