import React from 'react';
import { getStructuredData } from '../../utils/structuredData';

const StructuredData = ({ type, data }) => {
  const structuredData = getStructuredData(type, data);

  return (
    <script 
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

export default StructuredData;
