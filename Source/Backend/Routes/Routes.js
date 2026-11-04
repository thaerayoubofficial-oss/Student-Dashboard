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
router.get('/:sectionType', controller.GETSection);
router.post('/:sectionType', controller.POSTSection);
router.put('/:sectionType', controller.PUTSection);
router.delete('/:sectionType', controller.DELETESection);
router.patch('/:sectionType', controller.PATCHSection);


module.exports = router;