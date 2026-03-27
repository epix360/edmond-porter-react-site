const fs = require('fs');
const path = require('path');

// Define the paths
const booksDir = path.join(__dirname, '../public/content/books');
const outputFile = path.join(__dirname, '../public/content/books-index.json');

// Check if the directory exists
if (!fs.existsSync(booksDir)) {
  console.log('Books directory not found. Skipping index generation.');
  process.exit(0);
}

// Read all files in the books directory
const files = fs.readdirSync(booksDir);

const books = files
  .filter(file => file.endsWith('.json')) // Only grab JSON files
  .map(file => {
    const filePath = path.join(booksDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  });

// Write the array to a single index file
fs.writeFileSync(outputFile, JSON.stringify(books, null, 2));

console.log(`Successfully indexed ${books.length} books to ${outputFile}`);