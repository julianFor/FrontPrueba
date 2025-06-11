const express = require('express');
const router = express.Router();
const subcategoryController = require('../controllers/subcategoryController');
const { check } = require('express-validator');

//  middlewares de autenticación y rol
const authJwt = require('../middlewares/authJwt');
const { isAdmin } = require('../middlewares/role');
const { checkRole } = require('../middlewares/role');

// Validaciones
const validateSubcategory = [
    check('name').not().isEmpty().withMessage('El nombre es obligatorio'),
    check('description').not().isEmpty().withMessage('La descripción es obligatoria'),
    check('category').not().isEmpty().withMessage('La categoría es obligatoria'),
];

// Rutas
router.post('/', [authJwt.verifyToken, checkRole('admin', 'coordinador')], validateSubcategory, subcategoryController.createSubcategory);
router.get('/', subcategoryController.getSubcategories);
router.get('/:id', subcategoryController.getSubcategoryById);
router.put('/:id', [authJwt.verifyToken, checkRole('admin', 'coordinador')], validateSubcategory, subcategoryController.updateSubcategory);
router.delete('/:id', [authJwt.verifyToken, isAdmin], subcategoryController.deleteSubcategory);

module.exports = router;
