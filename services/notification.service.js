const NotiRepository = require("../repositories/notification.repository");
const Boom = require("boom");

class NotiService {
    notiRepository = new NotiRepository();

    getNotiList = async (userEmail) => {
        const list = await this.notiRepository.getNotiList(userEmail);

        return list
    }

    getNotiCount = async (userEmail) => {
        const count = await this.notiRepository.getNotiCount(userEmail);

        return count
    }

    confirmNoti = async (userEmail, notiId) => {
        const result = await this.notiRepository.confirmNoti(userEmail, notiId);

        return result
    }

    postNoti = async (userEmail, noti_receiver_email, noti_content) => {

        const noti_sender = await this.notiRepository.findNotiSenderProfile(userEmail);
        console.log("noti_sender", noti_sender)
        const notiData = {
            noti_sender : userEmail,
            noti_sender_nickname: noti_sender.profile_nickname,
            noti_sender_profileImg: noti_sender.profile_img,
            noti_type: 'announcement',
            noti_content: noti_content
        }
        await this.notiRepository.saveToStream(noti_receiver_email, notiData)
    }


}

module.exports = NotiService;