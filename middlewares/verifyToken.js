const Vendor = require('../models/Vendor');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const jwtSecret = process.env.WhatIsYourName;

const verifyToken =  async (req, res, next) => {
    const  token = req.headers.token;

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    try{
        const decoded = jwt.verify(token, jwtSecret);
        //console.log(decoded);
        const vendor = await Vendor.findById(decoded.vendorId);
        //console.log(vendor);
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found.' });
        }  
        //console.log(vendor._id) 
        req.vendorId = vendor._id
        next();
    }
    catch (error) {
        return res.status(400).json({ message: 'Invalid token.' });
    }
}

module.exports = verifyToken;   