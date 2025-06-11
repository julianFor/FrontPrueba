const express = require('express');
const router = express.Router();
const productControllers = require('../controllers/productControllers');
const { check } = require('express-validator');

// Importar middlewares
const authJwt = require('../middlewares/authJwt');
const { isAdmin } = require('../middlewares/role');
const { checkRole } = require('../middlewares/role');

const validateproduct = [
    check('name').not().isEmpty().withMessage('El nombre es obligatorio'),
    check('description').not().isEmpty().withMessage('La descripción es obligatoria'),
    check('price').isFloat({ min: 0 }).withMessage('Precio inválido'),
    check('stock').isInt({ min: 0 }).withMessage('Stock inválido'),
    check('category').not().isEmpty().withMessage('La categoría es obligatoria'),
    check('subcategory').not().isEmpty().withMessage('La subcategoría es requerida')
];

router.post('/', [authJwt.verifyToken, checkRole('admin', 'coordinador')], validateproduct, productControllers.createProduct);
router.get('/', productControllers.getProducts);
router.get('/:id', productControllers.getProductById);
router.put('/:id', [authJwt.verifyToken, checkRole('admin', 'coordinador')], validateproduct, productControllers.updateProduct);
router.delete('/:id', [authJwt.verifyToken, isAdmin], productControllers.deleteProduct);

module.exports = router;
