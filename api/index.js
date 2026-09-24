const app = require('../backend/server');
const { connectMongoDB, initialData } = require('../backend/config/db');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Ensure MongoDB connection is established for serverless execution
    try {
        await connectMongoDB();
    } catch (err) {
        console.error('Serverless MongoDB connection note:', err?.message || err);
    }

    return app(req, res);
};
