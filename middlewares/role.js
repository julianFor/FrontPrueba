const checkRole = (...allwedRoles) => {
    return(req, res, next) => {
        if (!req.userRole){
            console.error('Inetento de verificar rol son token valido');
            return res.status(500).json({
                success:false,
                message: 'Error al verificar rol'
            });
        }
        if (!allwedRoles.includes(req.userRole)) {
            console.log(`Acceso denegado para ${req.userEmail} (${req.userRole}) en ruta ${req.path}`);
            return res.status(403).json({
                success: false,
                message:'No tienes permiso para esta accion',
            })
        }
        next();
    };
};

//Funcion especificas por rol

const isAdmin = (req, res, next) => {
    return checkRole('admin')(req, res, next);
};

const isCoordinador = (req, res, next) => {
    return checkRole('coordinador')(req, res, next);
};
const isAxiliar = (req, res, next) => {
    return checkRole('auxiliar')(req, res, next);
};
module.exports = {
    checkRole,
    isAdmin,
    isCoordinador,
    isAxiliar
};

