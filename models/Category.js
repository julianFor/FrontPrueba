const mongoose = require('mongoose');

// Esquema de categoría con validaciones
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre de la categoría es obligatorio'],
        unique: true,
        trim: true,
        minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
        maxlength: [50, 'El nombre no puede exceder 50 caracteres']
    },
    description: {
        type: String, 
        required: [true, 'La descripción es obligatoria'],
        trim: true,
        maxlength: [200, 'La descripción no puede exceder 200 caracteres']
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,  // Agrega createdAt y updatedAt automáticamente
    versionKey: false  // Elimina el campo __v
});

// Middleware para manejo de índices únicos
categorySchema.pre('save', async function(next) {
    try {
        const collection = this.constructor.collection;
        
        // Verificar si el índice único existe y eliminarlo si es necesario
        const indexes = await collection.indexes();
        const problematicIndex = indexes.find(index => index.name === 'name_1');
        
        if (problematicIndex) {
            await collection.dropIndex('name_1');
            console.log('Índice único eliminado para recreación');
        }
        
        // Crear nuevo índice único con configuración personalizada
        await collection.createIndex({ name: 1 }, { 
            unique: true,
            name: 'name_1',
            collation: { locale: 'es', strength: 2 }  // Búsqueda case-insensitive en español
        });
        
    } catch (err) {
        // Ignorar error si el índice no existe
        if (!err.message.includes('index not found')) {
            console.error('Error en pre-save:', err);
            return next(err);
        }
    }
    next();
});

// Método estático para búsqueda case-insensitive
categorySchema.statics.findByName = async function(name) {
    return this.findOne({ name: new RegExp(`^${name}$`, 'i') });
};

// Middleware para limpieza antes de eliminar
categorySchema.pre('remove', async function(next) {
    try {
        // Aquí podrías agregar lógica para limpiar referencias en otros modelos
        console.log(`Eliminando categoría "${this.name}"`);
        next();
    } catch (err) {
        next(err);
    }
});

// Exportar modelo
const Category = mongoose.model('Category', categorySchema);
module.exports = Category;