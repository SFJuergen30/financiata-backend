// Este es el contenido completo y corregido para tu archivo: financiata-backend/index.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 🔴 ¡AQUÍ ESTÁ TU LLAVE SECRETA DE MONGODB!
const MONGO_URI = 'mongodb+srv://juergensf30:Monta2443077@cluster0.pdmhdih.mongodb.net/?appName=Cluster0';

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Conectado a la base de datos MongoDB Atlas'))
    .catch((err) => console.error('❌ Error de conexión a la base de datos:', err));

// Define cómo se verá una "transacción" en la base de datos
const TransactionSchema = new mongoose.Schema({
    userId: String,
    description: String,
    amount: Number,
    category: String,
    id: Number,
    isCreditCard: Boolean
});
const Transaction = mongoose.model('Transaction', TransactionSchema);

// --- RUTAS DE LA API (Las "puertas" de la cocina) ---

// Ruta para OBTENER todas las transacciones de un usuario
app.get('/transactions/:userId', async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.params.userId }).sort({ id: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Ruta para CREAR una nueva transacción
app.post('/transaction', async (req, res) => {
    try {
        const newTransaction = new Transaction(req.body);
        await newTransaction.save();
        res.status(201).json(newTransaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// --- ✅ RUTA PARA BORRAR (LA QUE FALTABA) ---
// Escucha peticiones DELETE en /transaction/ID_DEL_DOCUMENTO
app.delete('/transaction/:id', async (req, res) => {
    try {
        // Busca la transacción por su ID único de MongoDB (_id) y la borra
        const deletedTransaction = await Transaction.findByIdAndDelete(req.params.id);
        
        if (!deletedTransaction) {
            return res.status(404).json({ message: "Transacción no encontrada" });
        }
        
        res.json({ message: "Transacción eliminada exitosamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Inicia el servidor para que empiece a escuchar peticiones
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Servidor backend corriendo en el puerto ${PORT}`);
});
