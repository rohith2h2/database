function sanitizeData(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return sanitizeString(obj);
  }

  return Object.keys(obj).reduce((acc, key) => {
    // Skip sanitization for _id field
    if (key === '_id') {
      acc[key] = obj[key];
    } else if (typeof obj[key] === 'string') {
      acc[key] = sanitizeString(obj[key]);
    } else if (typeof obj[key] === 'object') {
      acc[key] = sanitizeData(obj[key]);
    } else {
      acc[key] = obj[key];
    }
    return acc;
  }, Array.isArray(obj) ? [] : {});
}

function sanitizeString(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/[^\x20-\x7E]/g, ''); // Only keep printable ASCII characters
}

module.exports = { sanitizeData, sanitizeString };