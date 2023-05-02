function getApiName(apiSegments) {
  if (
    apiSegments[0] === "banner" ||
    apiSegments[0] === "admin" ||
    apiSegments[0] === "notification" ||
    apiSegments[0] === "search"
  ) {
    return "exclude";
  }
  if (apiSegments[0] === "auth") {
    return apiSegments[1];
  } else if (apiSegments[0] === "artgram") {
    if (apiSegments[2] === "comments") {
      if (apiSegments[4] === "reply") {
        return "reply";
      } else {
        return "comments";
      }
    } else if (apiSegments[2] === "likes") {
      return "artgramLike";
    } else if (apiSegments[2] === "scrap") {
      return "artgramScrap";
    } else {
      return "artgram";
    }
  } else if (apiSegments[0] === "exhibition") {
    if (apiSegments[1] === "scrap") {
      return "exhibitionScrap";
    } else if (apiSegments[1] === "like") {
      return "exhibitionLike";
    } else if (apiSegments[1] === "reviews") {
      return "exhibitionReviews";
    } else if (apiSegments[2] === "reviews") {
      return "exhibitionReviews";
    } else {
      return "exhibition";
    }
  } else if (apiSegments[0] === "admin") {
    if (apiSegments[1] === "role") {
      return "adminRole";
    } else if (apiSegments[1] === "approvalList") {
      return "adminApprovalList";
    } else if (apiSegments[1] === "reportList") {
      return "adminReportList";
    } else {
      return "admin";
    }
  } else if (apiSegments[0] === "banner") {
    if (apiSegments[1].startsWith("getPersonalExhibitionsByRecent")) {
      return "bannerGetPersonalExhibitionsByRecent";
    } else if (
      apiSegments[1].startsWith("getOpenExhibitionsSortedByMostLike")
    ) {
      return "bannerGetOpenExhibitionsSortedByMostLike";
    } else if (apiSegments[1].startsWith("getOpenExhibitionsSortedByDate")) {
      return "bannerGetOpenExhibitionsSortedByDate";
    } else if (
      apiSegments[1].startsWith("getFutureExhibitionsSortedByNearest")
    ) {
      return "bannerGetFutureExhibitionsSortedByNearest";
    } else {
      return "banner";
    }
  } else {
    return "exclude";
  }
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

module.exports = { getApiName, isArtgramDetail, shouldAddDetail };
