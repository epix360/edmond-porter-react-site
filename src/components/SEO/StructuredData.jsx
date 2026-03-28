import React from 'react';

const StructuredData = ({ type, data }) => {
  const getStructuredData = () => {
    switch (type) {
      case 'author':
        return {
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "Edmond A Porter",
          "jobTitle": "Author",
          "description": "Contemporary author exploring human experience through compelling narratives and thoughtful prose.",
          "url": "https://edmondaporter.com",
          "sameAs": [
            "https://www.amazon.com/author/edmond-a-porter"
          ],
          "works": data.books?.map(book => ({
            "@type": "Book",
            "name": book.title,
            "genre": book.type,
            "description": book.description,
            "url": book.buyLink
          })) || []
        };
        
      case 'book':
        return {
          "@context": "https://schema.org",
          "@type": "Book",
          "name": data.title,
          "author": {
            "@type": "Person",
            "name": "Edmond A Porter"
          },
          "description": data.description,
          "genre": data.type,
          "url": data.buyLink,
          "image": `https://edmondaporter.com/images/${data.cover}`,
          "datePublished": data.releaseDate
        };
        
      case 'website':
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Edmond A Porter - Author Website",
          "description": "Contemporary author exploring human experience through compelling narratives and thoughtful prose.",
          "url": "https://edmondaporter.com",
          "author": {
            "@type": "Person",
            "name": "Edmond A Porter"
          },
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://edmondaporter.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        };
        
      default:
        return {};
    }
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(getStructuredData())}
    </script>
  );
};

export default StructuredData;
