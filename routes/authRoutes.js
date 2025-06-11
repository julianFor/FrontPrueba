const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControllers');
const verifySignUp = require('../middlewares/verifySignUp');
const { verifyToken } = require('../middlewares/authJwt');
const { checkRole } = require('../middlewares/role');

// Middleware de diagnóstico
router.use((req, res, next) => {
    console.log('\n[AuthRoutes] Petición recibida:', {
        method: req.method,
        path: req.path,
        Headers: {
            Authorization: req.headers.authorization ? '***' : 'NO',
            'X-access-token': req.headers['x-access-token'] ? '***' : 'No'
        }
    });
    next();
});

// Rutas de login (sin protección)
router.post('/signin', authController.signin);

// ✅ Ruta de registro protegida: solo admin y coordinador pueden registrar usuarios
router.post('/signup',
    verifyToken,
    checkRole('admin', 'coordinador'),
    verifySignUp.checkduplicateUsernameOrEmail,
    verifySignUp.checkRolesExisted,
    authController.signup
);

// Verificación final de rutas configuradas
console.log('[AuthRoutes] Rutas configuradas:', router.stack.map(layer => {
    return {
        path: layer.route?.path,
        method: layer.route?.methods
    };
}));

module.exports = router;
