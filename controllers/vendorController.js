const Vendor = require('../models/Vendor');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const vendorRegister = async (req, res) => {
    const {username, email, password} = req.body;

    try{
        // Check if vendor already exists
        const vendorEmail = await Vendor.findOne({email});
        if(vendorEmail){
            return res.status(400).json({message: 'Vendor already exists'});
        }   

        const hashedPassword = await bcrypt.hash(password, 10);
        const newVendor = new Vendor({
            username,
            email,
            password: hashedPassword
        })
        await newVendor.save();
        res.status(201).json({message: 'Vendor registered successfully'});
        console.log('Vendor registered successfully');

    }
    catch(err){
        console.error(err);
        return res.status(500).json({message: 'Server error'});
    }   

}

const jwtSecret = process.env.WhatIsYourName;

const vendorLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if vendor exists
        const vendor = await Vendor.findOne({ email });
        const isPasswordValid = await bcrypt.compare(password, vendor.password);

        if (!vendor || !isPasswordValid) {
            console.log("Invalid credentials");
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ vendorId: vendor._id }, jwtSecret, { expiresIn: '10h' });
        res.status(200).json({ message: 'Vendor logged in successfully', token,  vendor: { username: vendor.username, email: vendor.email } });
        console.log('Vendor logged in successfully');
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }

}

const getAllVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find().populate('firm');
        if (!vendors || vendors.length === 0) {
            return res.status(404).json({ message: 'No vendors found' });
        }
        res.status(200).json(vendors);
        console.log('Vendors retrieved successfully');
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    } 
}

const getVendorById = async (req, res) => {
    const vendorId = req.params.id;
    
    try{
        const vendor = await Vendor.findById(vendorId).populate('firm');
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }   
        res.status(200).json(vendor);
        console.log('Vendor retrieved successfully');

    }
    catch(err){
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
}

module.exports = { vendorRegister, vendorLogin, getAllVendors, getVendorById };