// Import mongoose ORM
const mongoose = require("mongoose");

// Create user model
const LogsModel = new mongoose.Schema(
  {
    ipv6: {
      type: String,
      required: true,
    },
    ipv4: {
      type: String,
      required: true,
    },
    subnetMask: {
      type: String,
      required: true,
    },
    defaultGateway: {
      type: String,
    },
  },
  { timestamps: true }
);

// Export this model for import in the routes that will need to use it
module.exports = mongoose.model("Logs", LogsModel);
