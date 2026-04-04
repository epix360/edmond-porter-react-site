/**
 * Structured Data Utility for Node.js Scripts
 * Provides consistent structured data generation for pre-render script
 */

const getStructuredData = (type, data = {}) => {
  switch (type) {
    case 'author':
      return {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Edmond A. Porter",
        "givenName": "Edmond",
        "familyName": "Porter",
        "jobTitle": "Author",
        "memberOf": {
          "@type": "Organization",
          "name": "The Writers' Cache"
        },
        "pronouns": "He/Him",
        "nationality": {
          "@type": "Country",
          "name": "US"
        },
        "url": "https://edmondaporter.com",
        "sameAs": [
          "https://www.amazon.com/author/edmond-a-porter",
          "https://www.goodreads.com/author/show/60996287.Edmond_A_Porter",
          "https://medium.com/@eporter609"
        ],
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": "https://edmondaporter.com"
        }
      };

    case 'book':
      return {
        "@context": "https://schema.org",
        "@type": "Book",
        "name": data.title,
        "alternateName": data.subtitle || "",
        "author": {
          "@type": "Person",
          "name": "Edmond A. Porter",
          "url": "https://edmondaporter.com"
        },
        "description": data.description,
        "genre": data.type,
        "isbn": data.isbn || "",
        "url": `https://edmondaporter.com/books/${data.slug}`,
        "image": `https://edmondaporter.com/images/${data.cover}`,
        "datePublished": data.releaseDate,
        "publisher": {
          "@type": "Organization",
          "name": data.publisher || "Self-Published"
        },
        "offers": {
          "@type": "Offer",
          "url": data.buyLink,
          "availability": "https://schema.org/InStock",
          "priceCurrency": "USD",
          "price": data.price || "0.00"
        }
      };

    case 'bookCollection':
      return {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Books by Edmond A Porter",
        "description": "Complete collection of books by Edmond A Porter, including contemporary fiction, essays, and poetry.",
        "url": "https://edmondaporter.com/#published-works",
        "about": {
          "@type": "Person",
          "name": "Edmond A Porter"
        },
        "mainEntity": {
          "@type": "ItemList",
          "numberOfItems": data.books ? data.books.length : 0,
          "itemListElement": data.books ? data.books.map((book, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
              "@type": "Book",
              "name": book.title,
              "description": book.description,
              "genre": book.type,
              "url": `https://edmondaporter.com/#published-works`,
              "image": `https://edmondaporter.com/images/${book.cover.replace(/^\//, '')}`,
              "author": {
                "@type": "Person",
                "name": "Edmond A. Porter",
                "url": "https://edmondaporter.com"
              },
              "offers": {
                "@type": "Offer",
                "url": book.buyLink,
                "availability": "https://schema.org/InStock",
                "priceCurrency": "USD",
                "price": "0.00"
              }
            }
          })) : []
        }
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

module.exports = { getStructuredData };
