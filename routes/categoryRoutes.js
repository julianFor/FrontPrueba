const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authJwt = require('../middlewares/authJwt');
const { isAdmin } = require('../middlewares/role'); 
const { checkRole } = require('../middlewares/role'); 

router.post('/', [authJwt.verifyToken, checkRole('admin', 'coordinador')], categoryController.createCategory);
// router.post('/', [authJwt.verifyToken], categoryController.createCategory);
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategoryById);
router.put('/:id', [authJwt.verifyToken, checkRole('admin', 'coordinador')], categoryController.updateCategory);
router.delete('/:id', [authJwt.verifyToken, isAdmin], categoryController.deleteCategory);

module.exports = router;
