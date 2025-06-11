const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const { User } = require('../models/User');

console.log('[AuthJWT] Configuración cargada: ', config.secret ? '***' + config.secret.slice(-5) : 'NO CONFIGURADO');

// Middleware de verificación de token
const verifyTokenFn = (req, res, next) => {
    console.log('\n[AuthJWT] Middleware ejecutándose para: ', req.originalUrl);

    try {
        const token = req.headers['x-access-token'] || req.headers.authorization?.split(' ')[1];
        console.log('[AuthJWT] Token recibido ', token ? '***' + token.slice(-8) : 'NO PROVISTO');

        if (!token) {
            console.log('[AuthJWT] Error: token no proporcionado');
            return res.status(403).json({
                success: false,
                message: 'Token no proporcionado'
            });
        }

        const decoded = jwt.verify(token, config.secret);

        req.userId = decoded.id;
        req.userRole = decoded.role;
        req.userEmail = decoded.email;

        console.log('[AuthJWT] Token válido para: ', decoded.email);
        next();

    } catch (error) {
        console.error('[AuthJWT] Error: ', error.name, '_', error.message);
        return res.status(401).json({
            success: false,
            message: 'Token inválido',
            error: error.name
        });
    }
};

// Validación antes de exportar
if (typeof verifyTokenFn !== 'function') {
    console.error('[AuthJWT] Error: verifyTokenFn no es una función válida');
    throw new Error('verifyTokenFn debe ser una función');
}

console.log('[AuthJWT] Middleware verifyTokenFn es una función: ', typeof verifyTokenFn);

module.exports = {
    verifyToken: verifyTokenFn
};
