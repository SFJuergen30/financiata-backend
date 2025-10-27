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
app.get('/transactions/:userId', async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.params.userId }).sort({ id: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
app.post('/transaction', async (req, res) => {
    try {
        const newTransaction = new Transaction(req.body);
        await newTransaction.save();
        res.status(201).json(newTransaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
app.delete('/transaction/:id', async (req, res) => {
    try {
        const deletedTransaction = await Transaction.findByIdAndDelete(req.params.id);
        if (!deletedTransaction) return res.status(404).json({ message: "Transacción no encontrada" });
        res.json({ message: "Transacción eliminada" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --- RUTAS PARA CATEGORÍAS ---
app.get('/categories/:userId', async (req, res) => {
    try {
        const categories = await Category.find({ userId: req.params.userId });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
app.post('/category', async (req, res) => {
    try {
        const existingCategory = await Category.findOne({ userId: req.body.userId, name: req.body.name });
        if (existingCategory) {
            return res.status(400).json({ message: "La categoría ya existe." });
        }
        const newCategory = new Category(req.body);
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
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
