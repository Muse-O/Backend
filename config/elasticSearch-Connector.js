const { Client } = require("@elastic/elasticsearch");
const client = new Client({
  cloud: {
    id: "Muse_O:dXMtY2VudHJhbDEuZ2NwLmNsb3VkLmVzLmlvJGIyZjU1MTA5NjEzNzRiODhhZDM2YmIwZTI1M2Y4ZGM2JGIyM2E4ZTliZmNmMzQxOWI4MTM0NekaTMxM2U4ZTZiYjZh",
  },
  auth: {
    username: "elastic",
    password: "wpF59gbvXnvErtlMxdoVdYy7",
  },
});

module.exports = client;
