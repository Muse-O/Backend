const { array } = require("joi");

// 배열내 객체를 문자열로
function convertArrayToString(obj) {
  const newObj = {};
  for (const [key, value] of Object.entries(obj)) {
    if (Array.isArray(value)) {
      if (value.length > 0 && typeof value[0] === 'object') {
        newObj[Object.keys(value[0])[0]] = value.map(v => v[Object.keys(v)[0]])[0];
      } else {
        newObj[key] = 0;
      }
    } else if (typeof value === 'object' && value !== null) {

      if (value instanceof Date) {
        newObj[key] = value.toISOString();
      } else {
        newObj[key] = convertArrayToString(value);
      } 
    } else {
      newObj[key] = value;
    }
  }
  return newObj;
}

module.exports = {convertArrayToString};