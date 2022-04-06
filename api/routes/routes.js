let express = require("express");
let app = express();
let router = express.Router();
let adminAuth = require("../middleware/AdminAuth");
let HomeController = require("../controllers/HomeController");
let UserController = require("../controllers/UserController");


router.get('/users', adminAuth, UserController.index);
router.get('/user/:id', adminAuth, UserController.findUser);
router.post('/user', UserController.create);
router.post('/recoverpassword', adminAuth, UserController.recoverPassword);
router.put('/user', adminAuth, UserController.edit);
router.delete('/user/:id', adminAuth, UserController.remove);

router.post('/validate', adminAuth, HomeController.validate);

router.get('/', HomeController.index);
router.post('/changepassword', UserController.changePassword);
router.post('/login', UserController.login);


module.exports = router;