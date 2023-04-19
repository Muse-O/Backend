const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

const NotiController = require("../controllers/notification.controller");
const notiController = new NotiController();

/**
 * @swagger
 * /notification/count:
 *    get:
 *      tags:
 *        - notification
 *      summary: 메인네비바
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                notiId:
 *                  type: string
 *                  description: "notiId 입력"
 *      response:
 *        "200":
 *          description: 읽음처리되지 않은 알림 갯수
 *          schema:
 *            type: object
 *            properties:
 *              result:
 *                type: string
 *      security:
 *        - jwt: []
 * /notification:
 *    get:
 *      tags:
 *        - notification
 *      summary: 마이페이지 알림창 읽음처리되지않은 알림 최신순 조회
 *      response:
 *        "200":
 *          description: "읽지않은 알림 최신조회"
 *          schema:
 *            type: object
 *            properties:
 *              result:
 *                type: string
 *      security:
 *        - jwt: []
 *    patch:
 *      tags:
 *       - notification
 *      summary: 마이페이지 알림 읽었다면
 *      response:
 *        "200":
 *          description: 알림 읽음 처리
 *          schema:
 *            type: object
 *            properties:
 *              result:
 *                type: string
 *      security:
 *        - jwt: []
 *    post:
 *      tags:
 *       - notification
 *      summary: 관리자용 알림 전송
 *      response:
 *        "200":
 *          description: 알림 전송(관리자공지전송시 사용)
 *          schema:
 *            type: object
 *            properties:
 *              result:
 *                type: string
 *      security:
 *        - jwt: []
 */

router.get("/", authMiddleware, notiController.getNotiList);
router.get("/count", authMiddleware, notiController.getNotiCount);
router.patch("/", authMiddleware, notiController.confirmNoti);
router.post("/", authMiddleware, notiController.postNoti);

module.exports = router;
