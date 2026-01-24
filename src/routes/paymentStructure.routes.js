const express = require("express");
const {
  createPaymentStructure,
  getAllPaymentStructures,
  getPaymentStructureById,
  updatePaymentStructure,
  deletePaymentStructure,
} = require("../controllers/paymentStructure.controller");

const router = express.Router();

router.post("/", createPaymentStructure);
router.get("/", getAllPaymentStructures);
router.get("/:id", getPaymentStructureById);
router.put("/:id", updatePaymentStructure);
router.delete("/:id", deletePaymentStructure);

module.exports = router;
