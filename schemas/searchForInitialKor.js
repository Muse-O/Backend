const _ = require("lodash");

function isKorean(searchText) {
  return /[가-힣ㄱ-ㅎ]/.test(searchText);
}

function ch2pattern(searchText) {
  const offset = 44032;

  if (/[가-힣]/.test(searchText)) {
    const chCode = searchText.charCodeAt(0) - offset;

    if (chCode % 28 > 0) {
      return searchText;
    }
    const begin = Math.floor(chCode / 28) * 28 + offset;
    const end = begin + 27;
    return `[\\u${begin.toString(16)}-\\u${end.toString(16)}]`;
  }

  if (/[ㄱ-ㅎ]/.test(searchText)) {
    const con2syl = {
      ㄱ: "가".charCodeAt(0),
      ㄲ: "까".charCodeAt(0),
      ㄴ: "나".charCodeAt(0),
      ㄷ: "다".charCodeAt(0),
      ㄸ: "따".charCodeAt(0),
      ㄹ: "라".charCodeAt(0),
      ㅁ: "마".charCodeAt(0),
      ㅂ: "바".charCodeAt(0),
      ㅃ: "빠".charCodeAt(0),
      ㅅ: "사".charCodeAt(0),
    };
    const begin =
      con2syl[searchText] ||
      (searchText.charCodeAt(0) - 12613) /* 'ㅅ'의 코드*/ * 588 + con2syl["ㅅ"];
    const end = begin + 587;
    return `[${searchText}\\u${begin.toString(16)}-\\u${end.toString(16)}]`;
  }

  if (/[a-zA-Z]/.test(searchText)) {
    return searchText;
  }

  return _.escapeRegExp(searchText);
}

function createFuzzyMatcherKor(searchText) {
  const pattern = searchText.split("").map(ch2pattern).join(".*?");
  return pattern;
}

module.exports.createFuzzyMatcherKor = createFuzzyMatcherKor;
module.exports.ch2pattern = ch2pattern;
module.exports.isKorean = isKorean;
