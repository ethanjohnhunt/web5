const GridItem = require('../models/GridItem');

exports.uploadGridItem = async (req, res) => {
    try {
        const { name, description } = req.body;
        const imageUrl = req.file.path;

        const newGridItem = new GridItem({
            name,
            description,
            image: imageUrl,
        });

        await newGridItem.save();
        res.status(201).json({ message: 'Grid item uploaded successfully', gridItem: newGridItem });
    } catch (error) {
        console.error('Error uploading grid item:', error);
        res.status(500).json({ error: 'Failed to upload grid item' });
    }
};

exports.getGridItems = async (req, res) => {
    try {
        const gridItems = await GridItem.find();
        res.status(200).json(gridItems);
    } catch (error) {
        console.error('Error fetching grid items:', error);
        res.status(500).json({ error: 'Failed to fetch grid items' });
    }
};
