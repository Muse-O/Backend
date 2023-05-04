// 한글 문자를 검사하여 searchText에 한글을 포함하는지 확인
function isKorean(searchText) {
  return /[가-힣ㄱ-ㅎㅏ-ㅣ]/.test(searchText);
}

//입력된 한글 문자에 대해 초성 검색을 위한 패턴을 생성
function ch2pattern(searchText) {
  const offset = 44032;

  //입력된 문자가 완성형 한글인 경우
  if (/[가-힣]/.test(searchText)) {
    const chCode = searchText.charCodeAt(0) - offset;

    if (chCode % 28 > 0) {
      return searchText;
    }
    const begin = Math.floor(chCode / 28) * 28 + offset;
    const end = begin + 27;
    return `[\\u${begin.toString(16)}-\\u${end.toString(16)}]`;
  }

  //입력된 문자가 한글 자음인 경우
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

  //입력된 문자가 위의 경우에 해당하지 않는 경우 정규식을 이스케이프한다.
  return searchText;
}

//입력된 문자가 영어 알파벳인 경우
function isEnglish(searchText) {
  return /[A-Z a-z]/.test(searchText);
}

//영어를 문자단위로 분해
function createFuzzyMatcherEng(searchText) {
  const pattern = searchText.split("").join(".*?");
  return pattern;
}

//특수문자 제거
function removeSpecialCharacters(searchText) {
  const SearchText = searchText.replace(/[<>]/g, "");
  return SearchText.replace(/\./g, "\\.");
}

// 한글 초성 검색 패턴을 생성하는 함수
// 입력된 문자열을 분해한 후 각 문자에 대해 ch2pattern 함수를 사용하여 패턴을 생성하고,
// 모든 패턴을 '.*?'로 연결하여 반환한다.
function createFuzzyMatcherKor(searchText) {
  const pattern = searchText.split("").map(ch2pattern).join(".*?");
  return pattern;
}

module.exports = {
  createFuzzyMatcherKor,
  ch2pattern,
  isKorean,
  isEnglish,
  createFuzzyMatcherEng,
  removeSpecialCharacters,
};
