function getApiName(apiSegments) {
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
    return "exhibition";
  } else {
    return "undifined";
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
