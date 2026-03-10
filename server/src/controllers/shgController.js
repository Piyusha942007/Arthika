const SHG = require('../models/SHG');

// @desc    Get all SHGs, optionally filtered by location
// @route   GET /api/shgs
// @access  Public
const getSHGs = async (req, res) => {
    try {
        const { location } = req.query;
        let query = {};

        // Basic case-insensitive search by location keyword
        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }

        const shgs = await SHG.find(query).limit(50); // Limit to top 50 for demo

        // Return structured response
        res.status(200).json({
            success: true,
            count: shgs.length,
            data: shgs
        });
    } catch (error) {
        console.error("Error fetching SHGs:", error);
        res.status(500).json({ success: false, message: 'Server Error fetching SHGs' });
    }
};

module.exports = {
    getSHGs
};
