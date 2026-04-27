import React from 'react';
import { getStructuredData } from '../../utils/structuredData';

const StructuredData = ({ structuredData }) => {
  // Support both single schema object and array of schema objects
  const schemas = Array.isArray(structuredData) 
    ? structuredData.map(sd => getStructuredData(sd.type, sd.data))
    : [getStructuredData(structuredData.type, structuredData.data)];

  return (
    <>
      {schemas.map((schema, index) => (
        <script 
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
};

export default StructuredData;
