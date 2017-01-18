var express = require('express');
var router = express.Router();
var apiCtrl = require('../controllers/ApiController');

router.get('/latest', apiCtrl.Latest);
router.get('/:term', apiCtrl.Search);

module.exports = router;
