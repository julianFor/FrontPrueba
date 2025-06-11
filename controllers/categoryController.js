const Category = require('../models/Category');

exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        // Validar que se recibieron los datos necesarios
        if (!name || typeof name !== 'string' || name.trim() === '') {
            return res.status(400).json({ 
                success: false,
                message: 'El nombre de la categoría es obligatorio y debe ser una cadena de texto.'
            });
        }
        if (!description || typeof description !== 'string' || description.trim() === '') {
            return res.status(400).json({ 
                success: false,
                message: 'La descripción de la categoría es obligatoria y debe ser texto válido'
            });
        }

        const trimmedName = name.trim();
        const trimmedDesc = description.trim();

        // Verificar si ya existe la categoría
        const existingCategory = await Category.findOne({ name: trimmedName });
        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: 'Ya existe una categoría con ese nombre'
            });
        }

        const newCategory = new Category({
            name: trimmedName,
            description: trimmedDesc
        });

        await newCategory.save();

        res.status(201).json({
            success: true,
            message: 'Categoría creada exitosamente',
            data: newCategory
        });

    } catch (error) {
        console.error('Error en createCategory:', error);

        // Manejo específico de error de duplicados
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Ya existe una categoría con ese nombre'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error al crear la categoría',
            error: error.message
        });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: categories
        });
    } catch (error) {
        console.error('Error en getCategories:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener categorías',
            error: error.message
        });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Categoría no encontrada'
            });
        }
        res.status(200).json({
            success: true,
            data: category
        });
    } catch (error) {
        console.error('Error en getCategoryById:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener categoría',
            error: error.message
        });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const updateData = {};
        
        if (name) {
            updateData.name = name.trim();
            // Verificar si el nuevo nombre ya existe 
            const existing = await Category.findOne({
                name: updateData.name,
                _id: { $ne: req.params.id }
            });
            if (existing) {
                return res.status(400).json({
                    success: false,
                    message: 'Ya existe una categoría con ese nombre'
                });
            }
        }
        if (description) {
            updateData.description = description.trim();
        }
        
        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!updatedCategory) {
            return res.status(404).json({
                success: false,
                message: 'Categoría no encontrada'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Categoría actualizada exitosamente',
            data: updatedCategory
        });
    } catch (error) {
        console.error('Error en updateCategory:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar la categoría',
            error: error.message
        });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);
        if (!deletedCategory) {
            return res.status(404).json({
                success: false,
                message: 'Categoría no encontrada'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Categoría eliminada exitosamente',
            data: deletedCategory
        });
    } catch (error) {
        console.error('Error en deleteCategory:', error);
        res.status(500).json({
            success: false, 
            message: 'Error al eliminar la categoría',
            error: error.message
        });
    }
};