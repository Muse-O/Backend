const { Redis } = require('ioredis');
const { UserProfile } = require("../models");
const logger = require("../middlewares/logger");
const Boom = require("boom");

const redis = new Redis({
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
    showFriendlyErrorStack: true
  });


class NotiRepository {

    constructor(){
        this.redis = redis;
    }

    /**
     * 알림창 정보 가져오기
     * @param {string} userEmail 
     * @returns 
     */
    getNotiList = async (userEmail) => {
      // 최신순으로 모든 메시지 가져오기
      const result = await this.redis.xrevrange(userEmail,'+','-');
    
      // 처리하지 않은 메시지의 ID들 가져오기
      const pending = await this.redis.xpending(userEmail, `noti_receiver_${userEmail}`, '-', '+', '1000000');
      const pendingIds = pending.map(entry => entry[0]);
      console.log('pendingIds======', pendingIds)
    
      // 처리하지 않은 메시지만 최신순으로 추출하여 반환하기
      const parsedData = result.map(entry => {
        const [notiId, values] = entry;
        const data = {};
        for (let i = 0; i < values.length; i += 2) {
          data[values[i]] = values[i + 1];
        }
        const seen = pendingIds.includes(notiId) ? false : true;
        return {
          notiId,
          seen,
          ...data
        };
      });
    
      return parsedData;
    }

    /**
     * 메인에 띄울만한 알림 카운트
     * @param {string} userEmail 
     * @returns 알림 갯수
     */
    getNotiCount = async (userEmail) => {
        const result = await this.redis.xpending(userEmail, `noti_receiver_${userEmail}`);
        console.log('result', result)
        if (!result[0]) return { count: 0 };
        const [, , , [count]] = result;
        return { count: count ? Number(count[1]) : 0 };
      };

    /**
     * 확인한건 처리해서 알림창에서 없앰
     * @param {string} userEmail 
     * @param {string} notiId 
     * @returns 확인 처리
     */
    confirmNoti = async (userEmail, notiId) => {
        
        const result = await this.redis.xack(userEmail, `noti_receiver_${userEmail}`, notiId)

        if (!result) {
          throw Boom.notFound(
            "확인처리에 실패하였습니다. 존재하지 않거나 이미 확인처리된 알림입니다."
          );
        }
        return
    }

    /**
     * userEmail이 회원 가입 시 스트림을 만든다
     * @param {string} userEmail 
     */
    createStream = async(userEmail) => {
        const streamKey = userEmail;
        const consumerGroup = `noti_receiver_${userEmail}`;

        try {
            const res1 = await this.redis.xgroup("CREATE", streamKey, consumerGroup, '$', 'MKSTREAM');
            console.log(`Consumer Group ${consumerGroup} created on Stream ${streamKey}`);
        } catch (error) {
            logger.error(error.message);
        } 
    }

    /**
     * 좋아요, 스크랩, 멘션 시 작성자의 스트림에 데이터를 추가한다
     * @param {string} userEmail 
     * @param {string} notiData 
     */
    saveToStream = async (userEmail, notiData) => {
        const streamKey = userEmail;

        const data = {
            ...notiData,
            createdAt: new Date(new Date().getTime() + 9 * 60 * 60 * 1000).toISOString(),
          };
        
        try {
            const res = await this.redis.xadd(streamKey, '*', ...Object.entries(data).flat())
            console.log(`Saved data to Stream ${streamKey}, with entry ID ${res}`)
            // XREADGROUP 호출하여 consumer에게 할당
            const count = 1; // 가져올 데이터 수
            const streamData = await this.redis.xreadgroup('GROUP', `noti_receiver_${userEmail}`, `${userEmail}`, 'COUNT', count, 'BLOCK', 5000, 'STREAMS', streamKey, '>');
            console.log(`Assigned to consumer, Stream data: ${JSON.stringify(streamData)}`);
        } catch (error) {
            logger.error(error.message);
        }
    }

    /**
     * 알림 발신자 프로필 조회
     * @param {string} userEmail 
     * @returns 닉네임, 프로필 이미지
     */
    findNotiSenderProfile = async (userEmail) =>{
      const sender = await UserProfile.findOne({
        where: { user_email: userEmail },
        attributes: ['profile_nickname']
      });
      return sender.dataValues;
    };

    /**
     * 탈퇴시 스트림 삭제
     * @param {string} userEmail 
     */
    deleteStream = async (userEmail) => {
        const streamKey = userEmail;
        const consumerGroup = `noti_receiver_${userEmail}`;

        try {
            const res = await this.redis.xgroup('DESTROY', streamKey, consumerGroup);
            console.log(`Consumer Group ${consumerGroup} destroyed on Stream ${streamKey}`);

            await this.redis.del(streamKey);
            console.log(`Stream ${streamKey} deleted`);
        } catch (error) {
            logger.error(error.message);
        }
    };
}

module.exports = NotiRepository