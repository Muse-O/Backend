const { Users } = require("../models");

adminPermission = async (userEmail) => {
  const adminAccess = await Users.findOne({
    where: { userEmail },
    attributes: ["userRole"],
  });
  const userRole = adminAccess.dataValues.userRole;
  return userRole;
};

module.exports = adminPermission;
