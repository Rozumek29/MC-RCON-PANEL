const database = require('../database/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

const refreshTokens = [];

router.post('/login', async (req, res) => {
    if (!req.body.email || !req.body.password) {
        res.status(400).json({message: "Please enter email and password"});
        return;
    }
    database.query("SELECT * FROM users WHERE email = ?", req.body.email, (err, result) => {
        if (result.length === 0) {
            res.status(404).json({message: "Incorrect email or password"});
        } else {
            if (!bcrypt.compareSync(req.body.password, result[0].password)) {
                res.status(401).json({message: "Incorrect email or password"});
            } else {
                const payload = {
                    Name: result[0].name,
                    Email: result[0].email,
                };
                const token = jwt.sign(payload, process.env.ACCESSTOKEN_SECRET, {expiresIn: process.env.ACCESSTOKEN_LIFE});
                const refreshToken = jwt.sign(payload, process.env.REFRESHTOKEN_SECRET);
                refreshTokens.push(refreshToken);
                res.status(200).json({token: token, refreshToken: refreshToken, expirationDate: process.env.ACCESSTOKEN_LIFE});
            }
        }
    });
});

router.post('/register', async (req, res) => {
    if (!req.body.email || !req.body.password || !req.body.name) {
        res.status(400).json({message: "Bad request"});
    }
    database.query("SELECT * FROM users WHERE email = ?", req.body.email, (err, result) => {
        if (result.length > 0) {
            res.status(409).json({message: "User already exists"});
        } else {
            const hash = bcrypt.hashSync(req.body.password, 10);
            database.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [req.body.name, req.body.email, hash], (err, result) => {
                if (err) {
                    console.log("Error", err);
                    res.status(500).json({message: "Internal server error"});
                } else {
                    res.status(201).json({message: "User created"});
                }
            });
        }
    });
});

router.post('/refreshToken', (req, res) => {
    if (!req.body.token) {
        return res.status(400).json({code: 400, message: "Bad request"});
    }
    const {token} = req.body;

    if (!refreshTokens.includes(token)) {
        return res.status(403);
    }

    jwt.verify(token, process.env.REFRESHTOKEN_SECRET, (err, user) => {
        if (err) {
            res.status(403);
        } else {
            const payload = {
                Name: user.Name,
                Email: user.Email,
            };
            const newToken = jwt.sign(payload, process.env.ACCESSTOKEN_SECRET, {expiresIn: process.env.ACCESSTOKEN_LIFE});
            refreshTokens.find((item, index) => {
                item === token ? refreshTokens.splice(index, 1) : null;
            });
            res.status(200).json({code: 200, token: newToken});
        }
    });
});

router.post('/logout', (req, res) => {
    if (!req.body.token) {
        return res.status(400).json({message: "Bad request"});
    }
    const token = req.body.token;
    if (!refreshTokens.includes(token)) {
        return res.status(403).json({message: "Forbidden"});
    }
    refreshTokens.find((item, index) => {
        item === token ? refreshTokens.splice(index, 1) : null;
    });
    res.status(200).json({message: "Logged out"});
});

module.exports = router;
