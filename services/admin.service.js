const AdminRepository = require("../repositories/admin.repository");

class AdminService {
  constructor() {
    this.adminRepository = new AdminRepository();
  }
}

module.exports = AdminService;
