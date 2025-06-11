const User = require('../models/User');
const bcrypt = require('bcryptjs');

//Obtener todos los usuarios (Solo Admin)
exports.getAllUsers = async (req, res) => {
    console.log('[CONTROLLER] ejecutando getAllUsers'); // Diagnóstico
    try {
        let users;

        // Filtro según el rol del usuario autenticado
        if (req.userRole === 'admin') {
            users = await User.find().select('-password');
        } else if (req.userRole === 'coordinador') {
            users = await User.find({ role: { $in: ['coordinador', 'auxiliar'] } }).select('-password');
        } else {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para ver todos los usuarios'
            });
        }

        console.log('[CONTROLLER] Usuarios encontrados:', users.length); // Diagnóstico
        res.status(200).json({
            success: true,
            data: users
        });

    } catch (error) {
        console.error('[CONTROLLER] Error en getAllUsers:', error.message); // Diagnóstico
        res.status(500).json({
            success: false,
            message: 'Error al obtener los usuarios'
        });
    }
};


//Obtener usaurio especifico
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        // ✅ Validación de acceso
        if (req.userRole === 'auxiliar') {
            if (req.userId !== user._id.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes permiso para ver este perfil'
                });
            }
        }

        if (req.userRole === 'coordinador' && user.role === 'admin') {
            return res.status(403).json({
                success: false,
                message: 'No puedes ver usuarios admin'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener el usuario',
            error: error.message
        });
    }
};



//Crear un nuevo usuario (Admin y coordinador)
exports.createUser = async (req, res) => {
    try {
        const {username, email, password, role} = req.body;

        const user = new User({
            username,
            email,
            password: await bcrypt.hash(password, 10),
            role
            });
            const savedUser = await user.save();
            res.status(201).json({
                success: true,
                message:'Usuario creado exitosamente',
                user:{
                    id:savedUser._id,
                    username: savedUser.username,
                    email: savedUser.email,
                    role: savedUser.role
                }
            });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear el usuario',
            error: error.message
        });
    }
};

//Actualizar un usuario (Admin y coordinador)
exports.updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        ).select('-password'); 
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });  
        }
        res.status(200).json({
            success: true,
            message: 'Usuario actualizado exitosamente',
            user: updatedUser
        });
    } catch (error){
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el usuario',
            error: error.message
        });
    }
};

//Eliminar un usuario (Admin y coordinador)
exports.deleteUser = async (req, res) => {
    console.log('[CONTROLLER] ejecutando deleteUser PARA ID; ', req.params.id); // Diagnostico
    try{
        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if(!deletedUser) {
            console.log('[CONTROLLER] Usuario no encontrado'); // Diagnostico
            return res.status(404).json({
                success:false,
                message: 'Usuario no encontrado'
            });
        }

        console.log('[CONTROLLER] Usuario eliminado: ', deletedUser._id ); // Diagnostico
        res.status(200).json({
            success: true,
            message: 'Usuario eliminado exitosamente',
        });
    } catch (error){
        console.error('[CONTROLLER] Error al eliminar Usuario:', error.message); // Diagnostico
        res.status(500).json({
            success: false,
            message: 'Error al eliminar el usuario'
        });
    }
};

