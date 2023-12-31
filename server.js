const express = require('express');
const mongoose = require('mongoose');
const { json, urlencoded } = require('body-parser');

const app = express();

app.use(json());
app.use(urlencoded({ extended: false }));

const port = 3000;

// Db connection
mongoose.connect('mongodb://localhost:27017/beveragedb');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Create schema
const beverageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter a beverage name"]
    },
    sugar: {
        type: Number,
        required: true,
        default: 0
    },
    rating: {
        type: Number,
        required: true,
        default: 0
    },
    scanned: {
        type: Boolean,
        default: false,
    },
    beverageImage: {
        type: String,
        required: false,
    }
});

// Create model for beverages
const Beverage = mongoose.model('Beverage', beverageSchema);

app.get('/', (req, res) => {
    res.send('Hello Beverage API')
})

// Retrieve beverages
app.get('/api/beverages', async (req, res) => {
    try {
        const beverages = await Beverage.find({});
        res.status(200).json(beverages);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
});

// Add a beverage
app.post('/api/beverages/add', async (req, res) => {
    try {
        console.log(req.body); // Log the request body to the console
        const newBeverage = new Beverage(req.body);
        const savedBeverage = await newBeverage.save();
        res.status(200).json(savedBeverage);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});

//get by id
app.get('/api/beverages/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const beverage = await Beverage.findById(id);
        res.status(200).json(beverage);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
});
// Update a beverage
app.put('/api/beverages/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const beverage = await Beverage.findByIdAndUpdate(id, req.body);

        if(!beverage) {
            return res.status(404).json({message: `cannot find any beverage witg the id, ${id}`})
        }
        const updatedBeverage = await Beverage.findById(id);
        res.status(200).json(updatedBeverage);

    } catch (error) {
        res.status(500).json({message: error.message})
    }
});

// Delete a beverage
app.delete('/api/beverages/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const beverage = await Beverage.findByIdAndDelete(id, req.body);

        if(!beverage) {
            return res.status(404).json({message: `cannot find any beverage witg the id, ${id}`})
        }
        res.status(200).json(beverage);
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
