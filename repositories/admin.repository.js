const { Users } = require("../models");

class AdminRepository extends Users {
  constructor() {
    super();
  }
}

module.exports = AdminRepository;
