const PaymentStructure = require("../models/PaymentStructure.Model");

// Create a new Payment Structure
exports.createPaymentStructure = async (req, res) => {
  try {
    const structure = new PaymentStructure(req.body);
    await structure.save();
    res.status(201).json(structure);
  } catch (error) {
    console.error("Create Error:", error);
    res
      .status(500)
      .json({ message: "Failed to create payment structure", error });
  }
};

// Get all Payment Structures (with optional filtering)
exports.getAllPaymentStructures = async (req, res) => {
  try {
    const { school, class: className, academicYear } = req.query;
    const filter = {};
    if (school) filter.school = school;
    if (className) filter.class = className;
    if (academicYear) filter.academicYear = academicYear;

    const structures = await PaymentStructure.find(filter).populate("school");
    res.status(200).json(structures);
  } catch (error) {
    console.error("Fetch All Error:", error);
    res
      .status(500)
      .json({ message: "Failed to get payment structures", error });
  }
};

// Get one by ID
exports.getPaymentStructureById = async (req, res) => {
  try {
    const structure = await PaymentStructure.findById(req.params.id).populate(
      "school"
    );
    if (!structure)
      return res.status(404).json({ message: "Payment structure not found" });

    res.json(structure);
  } catch (error) {
    console.error("Get By ID Error:", error);
    res.status(500).json({ message: "Failed to get payment structure", error });
  }
};

// Update by ID
exports.updatePaymentStructure = async (req, res) => {
  try {
    const structure = await PaymentStructure.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!structure)
      return res.status(404).json({ message: "Payment structure not found" });

    res.json(structure);
  } catch (error) {
    console.error("Update Error:", error);
    res
      .status(500)
      .json({ message: "Failed to update payment structure", error });
  }
};

// Delete by ID
exports.deletePaymentStructure = async (req, res) => {
  try {
    const result = await PaymentStructure.findByIdAndDelete(req.params.id);
    if (!result)
      return res.status(404).json({ message: "Payment structure not found" });

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res
      .status(500)
      .json({ message: "Failed to delete payment structure", error });
  }
};
