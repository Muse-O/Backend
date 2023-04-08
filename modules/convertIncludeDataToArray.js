function convertIncludeDataToArray(obj) {
  const newObj = {};
  for (const [key, value] of Object.entries(obj)) {
    if (Array.isArray(value)) {
      if (value.length > 0 && typeof value[0] === 'object') {
        // check if array has multiple objects
        if (value.length > 1) {
          newObj[key] = value.map(v => convertIncludeDataToArray(v));
        } else {
          newObj[key] = convertIncludeDataToArray(value[0]);
        }
      } else {
        newObj[key] = value;
      }
    } else if (typeof value === 'object' && value !== null) {
      if (value instanceof Date) {
        newObj[key] = value.toISOString();
      } else {
        newObj[key] = convertIncludeDataToArray(value);
      }
    } else {
      newObj[key] = value;
    }
  }
  return newObj;
}

module.exports = {convertIncludeDataToArray};