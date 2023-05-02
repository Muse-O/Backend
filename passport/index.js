const kakao = require('./kakao');
const google = require('./google');
const naver = require('./naver');

module.exports = () => {
    kakao();
    google();
    naver();
}