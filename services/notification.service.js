const NotiRepository = require("../repositories/notification.repository");
const Boom = require("boom");

class NotiService {
  notiRepository = new NotiRepository();

  /**
   * 알림 목록 조회
   * @param {string} userEmail
   * @returns 알림 목록
   */
  getNotiList = async (userEmail) => {
    const list = await this.notiRepository.getNotiList(userEmail);

    return list;
  };

  /**
   * 알림 갯수 조회
   * @param {string} userEmail
   * @returns 알림 갯수
   */
  getNotiCount = async (userEmail) => {
    const count = await this.notiRepository.getNotiCount(userEmail);

    return count;
  };

  /**
   * 알림 읽음처리
   * @param {string} userEmail
   * @param {string} notiId
   * @returns 알림 읽음 처리
   */
  confirmNoti = async (userEmail, notiId) => {
    const result = await this.notiRepository.confirmNoti(userEmail, notiId);

    return result;
  };

  /**
   * 관리자->개인 알림 전송용
   * @param {string} userEmail
   * @param {string} noti_receiver_email
   * @param {string} noti_content
   */
  postNoti = async (userEmail, noti_receiver_email, noti_content) => {
    const noti_sender = await this.notiRepository.findNotiSenderProfile(
      userEmail
    );
    console.log("noti_sender", noti_sender);
    const notiData = {
      noti_sender: userEmail,
      noti_sender_nickname: noti_sender.profile_nickname,
      noti_type: "announcement",
      noti_content: noti_content,
    };
    await this.notiRepository.saveToStream(noti_receiver_email, notiData);
  };
}

module.exports = NotiService;
