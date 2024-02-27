const { ImgurClient } = require('imgur');
const fs = require('fs');
const querystring = require('querystring');

exports.uploadImage = async (req, res, next) => {
    const client = new ImgurClient({
        clientId: process.env.IMGUR_CLIENT_ID,
        clientSecret: process.env.IMGUR_CLIENT_SECRET
    });
    try {
        const response = await client.upload({
            image: req.file.buffer.toString('base64'),
            type: 'base64', 
        });
        req.body.image = response.data.link;
        next();
    } catch (error) {
        res.status(500).send({ message: error.errors });
        return;
    }
};
