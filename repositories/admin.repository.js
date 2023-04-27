const { find } = require("lodash");
const { Users, ArticleReport, Exhibitions } = require("../models");

class AdminRepository extends Users {
  constructor() {
    super();
  }

  getPendingExhibitions = async () => {
    const exhibitionApprove = await Exhibitions.findAll({
      attributes: [
        "exhibitionId",
        "userEmail",
        "exhibitionTitle",
        "exhibitionEngTitle",
        "exhibitionDesc",
        "postImage",
        "exhibitionStatus",
      ],
      where: { exhibitionStatus: "ES05", [Op.ne]: "ES" },
    });
    return exhibitionApprove;
  };

  approveExhibition = async (exhibitionId) => {
    const approval = await Exhibitions.update(
      {
        exhibitionStatus: "ES01",
      },
      {
        where: { exhibitionId },
      }
    );
    return approval;
  };

  getAllReports = async () => {
    const reports = await ArticleReport.findAll({});
    console.log(reports);
    return reports;
  };

  // processReport = async() => {
  //   const
  // }
}

module.exports = AdminRepository;
