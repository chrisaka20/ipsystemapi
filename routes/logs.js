const router = require("express").Router();
const Logs = require("../models/Logs");
const {
  verifyTokenAndAuthorization,
  verifyToken,
  verifyTokenAndAdmin,
} = require("./jwtoken");

// CREATE LOG
router.post("/", verifyToken, async (req, res) => {
  try {
    const newLog = new Logs({
      ipv4: req.body.ipv4,
      ipv6: req.body.ipv6,
      subnetMask: req.body.subnetMask,
      defaultGateway: req.body.defaultGateway,
    });
    const log = await newLog.save();
    return res.status(200).json(log);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// UPDATE USER*****************************
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedLogs = await Logs.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    return res
      .status(200)
      .json({ message: "Log has been updted", updatedLogs });
  } catch (err) {
    return res.status(500).json(err);
  }
});

//GET LOG
router.get("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const log = await Logs.findById(req.params.id);
    return res.status(200).json(log);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//GET ALL LOGS
router.get("/", verifyToken, async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await Logs.find().sort({ _id: -1 }).limit(5)
      : await Logs.find();
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// GET LOGS STATS
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await Logs.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
