const getKeyObjectFromRows = (row, ...columns) => {
  const newObj = {};
    columns.forEach((col) => {
      newObj[col] = row[col];
    });

  for (let prop in newObj) {
    if (prop) {
      delete row[prop];
    }
  }
  
  return newObj;
};

module.exports = {getKeyObjectFromRows};