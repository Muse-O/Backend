// 주어진 row에서 columns에 해당하는 속성만 추출하여 새로운 객체를 생성하는 함수
const getKeyObjectFromRows = (row, ...columns) => {
  const newObj = {};
  // columns 배열을 순회하며 newObj 객체에 해당 속성을 추가
  columns.forEach((col) => {
    newObj[col] = row[col];
  });

  // newObj 객체의 속성을 순회하며 row 객체에서 해당 속성을 삭제
  for (let prop in newObj) {
    if (prop) {
      delete row[prop];
    }
  }

  // 추출한 속성만 가지고 있는 newObj 객체 반환
  return newObj;
};

module.exports = { getKeyObjectFromRows };
