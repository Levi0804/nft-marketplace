const { NFTStorage, File } = require('nft.storage');
const fs = require('fs');
const path = require('path');
const mime = require('mime');

// Replace with your API key from https://nft.storage
const NFT_STORAGE_KEY = '824c5689.2929f9b387764a2b92c8bb782906e37a';

// Configure the directory containing your images
const IMAGES_PATH = './public';

async function uploadToIPFS() {
    try {
        // Create NFTStorage client
        const client = new NFTStorage({ token: NFT_STORAGE_KEY });

        // Read all SVG files from the directory
        const files = fs.readdirSync(IMAGES_PATH)
            .filter(file => file.toLowerCase().endsWith('.svg'));

        console.log(`Found ${files.length} SVG files to upload`);

        // Prepare files for upload
        const fileObjects = await Promise.all(
            files.map(async (fileName) => {
                const filePath = path.join(IMAGES_PATH, fileName);
                const content = fs.readFileSync(filePath);
                const type = mime.getType(filePath);
                
                return new File(
                    [content], 
                    fileName, 
                    { type }
                );
            })
        );

        console.log('Uploading files to IPFS via NFT.Storage...');
        const cid = await client.storeDirectory(fileObjects);
        console.log('Upload completed! 🎉');
        
        // Generate the IPFS URLs for each file
        const baseUrl = `ipfs://${cid}/`;
        const urls = files.map(fileName => ({
            fileName,
            url: `${baseUrl}${fileName}`
        }));

        // Save the URLs to a JSON file
        const urlsFile = {
            collectionCID: cid,
            baseUrl,
            files: urls
        };

        fs.writeFileSync(
            'ipfs-urls.json',
            JSON.stringify(urlsFile, null, 2)
        );

        console.log('\nUpload Summary:');
        console.log('==============');
        console.log(`Collection CID: ${cid}`);
        console.log(`Base URL: ${baseUrl}`);
        console.log(`Individual files can be accessed at: ${baseUrl}<filename>`);
        console.log('\nURLs have been saved to ipfs-urls.json');
        
        // Also output gateway URLs for easy viewing
        console.log('\nGateway URLs for viewing:');
        console.log('========================');
        console.log(`https://${cid}.ipfs.nftstorage.link/`);
        console.log(`https://ipfs.io/ipfs/${cid}/`);

    } catch (error) {
        console.error('Error uploading to IPFS:', error);
        process.exit(1);
    }
}

// Execute the upload
uploadToIPFS();