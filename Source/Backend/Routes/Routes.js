const express = require('express');
const controller = require('../Controllers/Controller.js');
const authController = require('../Controllers/AuthController.js');
const router = express.Router();

router.use((req, res, next) => {
    console.log('Incoming request:', req.method, req.originalUrl);
    next();
});


router.post('/signup', authController.signup);

router.get('/', controller.GET);
router.get('/:Section', controller.GETSection);
router.post('/:Section', controller.POSTSection);
router.put('/:Section', controller.PUTSection);
router.delete('/:Section', controller.DELETESection);
router.patch('/:Section', controller.PATCHSection);


module.exports = router;