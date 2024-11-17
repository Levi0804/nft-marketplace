const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
    name: "Your NFT Collection Name",
    description: "Description of your NFT collection",
    baseImagePath: "./public", // Update this to your SVG images path
    baseImageUri: "ipfs://YOUR_IMAGES_CID/", // You'll update this after uploading images
    outputDir: "./metadata"
};

// Metadata template
const getMetadata = (index, imageName) => ({
    name: `${CONFIG.name} #${index}`,
    description: CONFIG.description,
    image: `${CONFIG.baseImageUri}${imageName}`,
    edition: index,
    date: Date.now(),
    attributes: [
        // Add your attributes here
        // Example:
        // {
        //     trait_type: "Background",
        //     value: "Blue"
        // }
    ],
    compiler: "Your NFT Collection"
});

async function generateMetadata() {
    try {
        // Create output directory if it doesn't exist
        if (!fs.existsSync(CONFIG.outputDir)) {
            fs.mkdirSync(CONFIG.outputDir, { recursive: true });
        }

        // Read all SVG files from the directory
        const files = fs.readdirSync(CONFIG.baseImagePath)
            .filter(file => file.toLowerCase().endsWith('.svg'));

        console.log(`Found ${files.length} SVG files`);

        // Generate metadata for each file
        files.forEach((file, index) => {
            const metadata = getMetadata(index + 1, file);
            
            // Write metadata to JSON file
            const metadataPath = path.join(CONFIG.outputDir, `${index + 1}.json`);
            fs.writeFileSync(
                metadataPath,
                JSON.stringify(metadata, null, 2)
            );
            
            console.log(`Generated metadata for ${file} -> ${metadataPath}`);
        });

        // Generate collection metadata
        const collectionMetadata = {
            name: CONFIG.name,
            description: CONFIG.description,
            image: `${CONFIG.baseImageUri}collection-logo.svg`, // If you have a collection logo
            external_link: "https://your-website.com",
            seller_fee_basis_points: 250, // 2.5% royalty
            fee_recipient: "YOUR_WALLET_ADDRESS" // Address to receive royalties
        };

        fs.writeFileSync(
            path.join(CONFIG.outputDir, 'collection.json'),
            JSON.stringify(collectionMetadata, null, 2)
        );

        console.log('✨ Metadata generation completed!');

    } catch (error) {
        console.error('Error generating metadata:', error);
    }
}

// Execute the script
generateMetadata();