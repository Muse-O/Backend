function isNotNull(value) {
  if (typeof value !== "undefined" && value !== null) {
    if (value === "") {
      return false;
    }
    // 배열, 객체 검증
    if (typeof value === "object") {
      return Object.entries(value).length > 0 ? true : false;
    }
    return true;
  } else {
    return false;
  }
}

module.exports = { isNotNull };
