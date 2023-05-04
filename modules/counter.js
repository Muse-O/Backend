function getMethodApiName(apiSegments) {
  if (apiSegments[1] === "artgram") {
    if (apiSegments[2] && apiSegments[2].length === 36) {
      if (apiSegments[3] === "comments") {
        if (
          apiSegments[4] &&
          apiSegments[4].length === 36 &&
          apiSegments[5] === "reply"
        ) {
          return "artgramListReplies";
        } else {
          return "artgramListComments";
        }
      } else {
        return "artgramDetail";
      }
    } else {
      return "artgramAll";
    }
  } else if (apiSegments[1] === "exhibition") {
    if (apiSegments[2] === "view" && apiSegments[3]) {
      return "exhibitionDetail";
    } else if (apiSegments[2] && apiSegments[3] === "reviews") {
      return "exhibitionListReviews";
    } else {
      return "exhibitionAll";
    }
  } else if (apiSegments[1] === "mypage") {
    if (apiSegments[2] === "exhibition") {
      if (apiSegments[3] === "likes") {
        return "mypageExhibitionLikes";
      } else if (apiSegments[3] === "scrap") {
        return "mypageExhibitionScrap";
      } else {
        return "mypageExhibition";
      }
    } else if (apiSegments[2] === "artgram") {
      if (apiSegments[3] === "likes") {
        return "mypageArtgramLikes";
      } else if (apiSegments[3] === "scraps") {
        return "mypageArtgramScraps";
      } else if (apiSegments[3] && apiSegments[3].length === 36) {
        return "mypageArtgramDetail";
      } else {
        return "mypageArtgram";
      }
    }
  } else if (apiSegments[1] === "auth") {
    if (apiSegments[2] === "kakao") {
      return "authKakao";
    } else if (apiSegments[2] === "google") {
      return "authGoogle";
    } else if (apiSegments[2] === "naver") {
      return "authNaver";
    }
  } else if (apiSegments[1] === "search") {
    return "search";
  } else {
    apiName = "exclude";
  }
}

function postMethodApiName(apiSegments) {
  if (apiSegments[1] === "artgram") {
    if (!apiSegments[2]) {
      return "artgramCreate";
    } else if (
      apiSegments[2] &&
      apiSegments[2].length === 36 &&
      apiSegments[3] === "comments"
    ) {
      if (
        apiSegments[4] &&
        apiSegments[4].length === 36 &&
        apiSegments[5] === "reply"
      ) {
        return "artgramCreateReply";
      } else {
        return "artgramCreateComment";
      }
    }
  } else if (apiSegments[1] === "exhibition") {
    if (apiSegments[2] === "write") {
      return "exhibitionCreate";
    } else if (
      apiSegments[2] === "reviews" &&
      apiSegments[3] === "write" &&
      apiSegments[4]
    ) {
      return "exhibitionCreateReview";
    }
  } else if (apiSegments[1] === "auth") {
    if (apiSegments[2] === "login") {
      return "authLogin";
    } else if (apiSegments[2] === "signup") {
      return "authSignup";
    }
  } else if (apiSegments[1] === "search") {
    return "searchSaveLastViewed";
  } else {
    apiName = "exclude";
  }
}

function patchMethodApiName(apiSegments) {
  if (
    apiSegments[1] === "artgram" &&
    apiSegments[2] &&
    apiSegments[2].length === 36
  ) {
    if (!apiSegments[3]) {
      return "artgramModify";
    } else if (apiSegments[3] === "remove") {
      return "artgramDelete";
    } else if (apiSegments[3] === "scrap") {
      return "artgramScrap";
    } else if (apiSegments[3] === "likes") {
      return "artgramLike";
    } else if (
      apiSegments[3] === "comments" &&
      apiSegments[4] &&
      apiSegments[4].length === 36
    ) {
      if (!apiSegments[5]) {
        return "artgramModifyComment";
      } else if (apiSegments[5] === "remove") {
        return "artgramDeleteComment";
      } else if (
        apiSegments[5] === "reply" &&
        apiSegments[6] &&
        apiSegments[6].length === 36
      ) {
        if (!apiSegments[7]) {
          return "artgramModifyReply";
        } else if (apiSegments[7] === "remove") {
          return "artgramDeleteReply";
        }
      }
    }
  } else if (apiSegments[1] === "exhibition") {
    if (apiSegments[2] === "update" && apiSegments[3]) {
      return "exhibitionModify";
    } else if (apiSegments[2] === "delete" && apiSegments[3]) {
      return "exhibitionDelete";
    } else if (apiSegments[2] === "scrap" && apiSegments[3]) {
      return "exhibitionScrap";
    } else if (apiSegments[2] === "like" && apiSegments[3]) {
      return "exhibitionLike";
    }
  } else {
    apiName = "exclude";
  }
}

function processRequest(apiSegments, method) {
  let apiName;

  if (method === "GET") {
    apiName = getMethodApiName(apiSegments);
  } else if (method === "POST") {
    apiName = postMethodApiName(apiSegments);
  } else if (method === "PATCH") {
    apiName = patchMethodApiName(apiSegments);
  } else {
    apiName = "exclude";
  }

  return apiName;
}

function isArtgramDetail(apiSegments) {
  return apiSegments[0] === "artgram" && apiSegments.length > 1;
}

function shouldAddDetail(apiName, apiSegments) {
  if (apiName === "artgram") {
    return isArtgramDetail(apiSegments);
  }
  return false;
}

module.exports = { processRequest, isArtgramDetail, shouldAddDetail };
