/**
 * Shared Structured Data Utility
 * Provides consistent structured data generation for both React components and pre-render script
 */

const getStructuredData = (type, data = {}) => {
  switch (type) {
    case 'author':
      return {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Edmond A Porter",
        "alternateName": "Edmond Porter",
        "givenName": "Edmond",
        "familyName": "Porter",
        "jobTitle": "Author",
        "memberOf": [
          {
            "@type": "Organization",
            "@id": "https://edmondaporter.com/#league-of-utah-writers",
            "name": "League of Utah Writers",
            "url": "https://www.leagueofutahwriters.com/"
          },
          {
            "@type": "Organization",
            "name": "Brigham City Writers",
            "url": "https://www.leagueofutahwriters.com/chapterlistings/brigham-city-writers",
            "parentOrganization": {
              "@id": "https://edmondaporter.com/#league-of-utah-writers"
            }
          },
          {
            "@type": "Organization",
            "name": "The Writers' Cache",
            "alternateName": "Cache Valley Chapter",
            "url": "http://www.writerscache.org/",
            "sameAs": [
              "https://www.leagueofutahwriters.com/chapterlistings/cache-valley-chapter"
            ],
            "parentOrganization": {
              "@id": "https://edmondaporter.com/#league-of-utah-writers"
            }
          }
        ],
        "pronouns": "He/Him",
        "nationality": {
          "@type": "Country",
          "name": "US"
        },
        "url": "https://edmondaporter.com",
        "sameAs": [
          "https://www.amazon.com/stores/Edmond-A-Porter/author/B0FXDLK38Y",
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
          "name": "Edmond A Porter",
          "url": "https://edmondaporter.com"
        },
        "description": data.description,
        "genre": data.type,
        "isbn": data.isbn || "",
        "url": `https://edmondaporter.com/books/${data.slug}`,
        "image": `https://edmondaporter.com/images/${data.cover.replace(/^\//, '')}`,
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
                "name": "Edmond A Porter",
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
        }
      };

    case 'publisher':
      // Redwood Vail Press — used as the canonical publisher Organization
      // entity referenced from book schema via @id.
      return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": "https://edmondaporter.com/redwood-vail-press#org",
        "name": "Redwood Vail Press",
        "url": "https://edmondaporter.com/redwood-vail-press",
        "logo": {
          "@type": "ImageObject",
          "url": "https://edmondaporter.com/images/Redwood-Vail-Press-Publisher-Logo.webp"
        }
      };

    case 'event':
      // data: { name, startDate, endDate, url, description, locationName,
      //         locationAddress, organizerName, organizerUrl, performerName,
      //         performerUrl, aboutEvent, image }
      return {
        "@context": "https://schema.org",
        "@type": "Event",
        "name": data.name,
        "startDate": data.startDate,
        "endDate": data.endDate || data.startDate,
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "eventStatus": "https://schema.org/EventScheduled",
        "url": data.url,
        "description": data.description,
        "location": {
          "@type": "Place",
          "name": data.locationName,
          "address": data.locationAddress
        },
        ...(data.organizerName && {
          "organizer": {
            "@type": "Organization",
            "name": data.organizerName,
            "url": data.organizerUrl
          }
        }),
        ...(data.performerName && {
          "performer": {
            "@type": "Person",
            "name": data.performerName,
            "url": data.performerUrl
          }
        }),
        ...(data.aboutEvent && {
          "about": {
            "@type": "Event",
            "name": data.aboutEvent.name,
            "startDate": data.aboutEvent.startDate,
            "location": {
              "@type": "Place",
              "name": data.aboutEvent.locationName
            }
          }
        }),
        ...(data.image && { "image": data.image })
      };

    case 'breadcrumb':
      // data.items: [{ name, url }] in trail order, e.g.
      //   [{ name: 'Home', url: 'https://...' }, { name: 'Books', url: '...' }, { name: 'Title', url: '...' }]
      return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": (data.items || []).map((item, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": item.name,
          "item": item.url
        }))
      };

    default:
      return {};
  }
};

// Support both CommonJS and ES modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getStructuredData };
}

if (typeof exports !== 'undefined' && exports) {
  exports.getStructuredData = getStructuredData;
}

// ES module export for React components
export { getStructuredData };
