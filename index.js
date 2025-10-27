const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 🔴 ¡RECUERDA VERIFICAR TU CONTRASEÑA!
const MONGO_URI = 'mongodb+srv://juergensf30:Monta2443077@cluster0.pdmhdih.mongodb.net/?appName=Cluster0';

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Conectado a MongoDB'))
    .catch((err) => console.error('❌ Error de conexión:', err));

// --- MODELOS DE DATOS ---
const TransactionSchema = new mongoose.Schema({
    userId: String, description: String, amount: Number,
    category: String, id: Number, isCreditCard: Boolean
});
const Transaction = mongoose.model('Transaction', TransactionSchema);

const CategorySchema = new mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
});
const Category = mongoose.model('Category', CategorySchema);


// --- RUTAS DE LA API ---
app.get('/transactions/:userId', async (req, res) => { /* ... (sin cambios) */ });
app.post('/transaction', async (req, res) => { /* ... (sin cambios) */ });
app.delete('/transaction/:id', async (req, res) => { /* ... (sin cambios) */ });
app.get('/categories/:userId', async (req, res) => { /* ... (sin cambios) */ });
app.post('/category', async (req, res) => { /* ... (sin cambios) */ });

// --- ✅ NUEVA RUTA PARA BORRAR CATEGORÍAS ---
app.delete('/category/:id', async (req, res) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);
        if (!deletedCategory) {
            return res.status(404).json({ message: "Categoría no encontrada." });
        }
        res.json({ message: "Categoría eliminada exitosamente." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Servidor backend corriendo en el puerto ${PORT}`);
});
