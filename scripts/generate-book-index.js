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

// Validation function
function validateBook(book, filename) {
  const requiredFields = ['title', 'order', 'cover', 'type', 'buyLink', 'description'];
  
  // Check required fields
  for (const field of requiredFields) {
    if (!book[field]) {
      console.error(`❌ Missing required field '${field}' in ${filename}`);
      return false;
    }
  }
  
  // Validate order is a number
  if (typeof book.order !== 'number' || book.order < 0) {
    console.error(`❌ Invalid order '${book.order}' in ${filename}. Must be a positive number.`);
    return false;
  }
  
  // Validate buy link is a URL
  if (!book.buyLink.match(/^https?:\/\/.+/)) {
    console.error(`❌ Invalid buy link '${book.buyLink}' in ${filename}. Must be a valid URL.`);
    return false;
  }
  
  // Check if cover image exists
  let coverPath;
  if (book.cover.startsWith('/')) {
    // Remove leading slash and check in images directory
    const cleanCover = book.cover.replace(/^\//, '');
    coverPath = path.join(__dirname, '../public/images', cleanCover);
  } else {
    coverPath = path.join(__dirname, '../public/images', book.cover);
  }
  
  if (!fs.existsSync(coverPath)) {
    console.error(`❌ Cover image not found: ${book.cover} for ${filename}`);
    console.error(`   Looking for: ${coverPath}`);
    return false;
  }
  
  return true;
}

// Process books
const books = files
  .filter(file => file.endsWith('.json')) // Only grab JSON files
  .map(file => {
    const filePath = path.join(booksDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    try {
      const book = JSON.parse(content);
      
      // Validate book structure
      if (!validateBook(book, file)) {
        throw new Error(`Validation failed for ${file}`);
      }
      
      return book;
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
      throw error;
    }
  });

// Check for duplicate orders
const orders = books.map(book => book.order);
const duplicateOrders = orders.filter((order, index) => orders.indexOf(order) !== index);
if (duplicateOrders.length > 0) {
  console.error(`❌ Duplicate order numbers found: ${duplicateOrders.join(', ')}`);
  process.exit(1);
}

// Sort books by order
books.sort((a, b) => a.order - b.order);

// Write the array to a single index file
fs.writeFileSync(outputFile, JSON.stringify(books, null, 2));

console.log(`✅ Successfully indexed ${books.length} books to ${outputFile}`);
console.log(`📚 Books in order: ${books.map(book => `${book.order}. ${book.title}`).join(', ')}`);