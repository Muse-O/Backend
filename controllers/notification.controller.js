const NotiService = require("../services/notification.service");
const logger = require("../middlewares/logger.js");
const Boom = require("boom");

class NotiController {
  notiService = new NotiService();

  /**
   * 알림 목록 조회
   */
  getNotiList = async (req, res, next) => {
    try {
      const { userEmail } = res.locals.user;
      const result = await this.notiService.getNotiList(userEmail);
      return res.status(200).json({ result });
    } catch (error) {
      logger.error(error.message);
      next(error);
    }
  };

  /**
   * 알림 갯수 조회
   */
  getNotiCount = async (req, res, next) => {
    try {
      const { userEmail } = res.locals.user;
      const count = await this.notiService.getNotiCount(userEmail);
      return res.status(200).json(count);
    } catch (error) {
      logger.error(error.message);
      next(error);
    }
  };

  /**
   * 알림 읽음처리
   */
  confirmNoti = async (req, res, next) => {
    try {
      const { userEmail } = res.locals.user;
      const { notiId } = req.body;
      await this.notiService.confirmNoti(userEmail, notiId);
      return res.status(200).json({ message: "알림 읽음 처리되었습니다" });
    } catch (error) {
      logger.error(error.message);
      next(error);
    }
  };

  /**
   * 관리자->개인 알림 전송용
   */
  postNoti = async (req, res, next) => {
    try {
      const { userEmail } = res.locals.user;
      const { noti_receiver_email, noti_content } = req.body;
      await this.notiService.postNoti(
        userEmail,
        noti_receiver_email,
        noti_content
      );
      return res.status(200).json({ message: "알림 발신 처리되었습니다" });
    } catch (error) {
      logger.error(error.message);
      next(error);
    }
  };
}

module.exports = NotiController;
