
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const vendorRoutes = require('./routes/vendorRoutes');
const firmRoutes = require('./routes/firmRoutes');
const productRoutes = require('./routes/productRoutes');
// const productRoutes = require('./routes/productRoutes');

const app = express();
const port = 3000;

dotenv.config();
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("Connected to MongoDB successfully"); 
})
.catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});

app.use(express.json());

app.use('/vendor', vendorRoutes);
// app.use('/product', productRoutes);

app.use('/firm', firmRoutes);

app.use('/product', productRoutes);
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.use('/', (req, res)=> {
    res.send("<h1>Welcome to Charan's project</h1>");
})
