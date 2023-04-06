const kakao = require('./kakao');
const google = require('./google')

module.exports = () => {
    kakao();
    google();
}