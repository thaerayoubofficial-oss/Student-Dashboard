const express = require('express');
const controller = require('../Controllers/Controller.js');
const router = express.Router();


router.get('/', controller.GET);
router.get('/:Section', controller.GETSection);
router.post('/:Section', controller.POSTSection);
router.put('/:Section', controller.PUTSection);
router.delete('/:Section', controller.DELETESection);


module.exports = router;