const Bookshelf = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    // This file is now automatically generated at build time!
    fetch('/content/books-index.json')
      .then(res => res.json())
      .then(data => setBooks(data));
  }, []);

  return (
    <div className="book-grid">
      {books.map((book, index) => (
        <div key={index} className="book-card">
          <img src={book.cover} alt={book.title} />
          <h3>{book.title}</h3>
          <p>{book.genre}</p>
          <a href={book.buyLink}>Buy Now</a>
        </div>
      ))}
    </div>
  );
};

export default Bookshelf;