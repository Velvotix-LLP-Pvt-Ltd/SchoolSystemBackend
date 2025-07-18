const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const SchoolSchema = new mongoose.Schema(
  {
    school_code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    school_name: {
      type: String,
      required: true,
    },
    academic_year: {
      type: String,
      required: true,
    },
    location: {
      state: String,
      state_code: String,
      district: String,
      district_code: String,
      block: String,
      cluster: String,
      village_town: String,
      pin_code: String,
      geo: {
        latitude: Number,
        longitude: Number,
      },
      urban_rural: {
        type: String,
      },
    },
    established_year: Number,
    school_category: String,
    school_type: String,
    school_management: String,
    affiliation_board: String,
    medium_of_instruction: [String],
    school_shift: String,
    school_building_status: String,
    academic_session_start_month: String,

    headmaster: {
      name: String,
      mobile: String,
      email: String,
    },

    enrollment_summary: {
      total_students: Number,
      boys: Number,
      girls: Number,
      cwsn: Number,
    },

    staff_summary: {
      total_teachers: Number,
      male_teachers: Number,
      female_teachers: Number,
      trained_teachers: Number,
      non_teaching_staff: Number,
    },

    infrastructure: {
      total_classrooms: Number,
      rooms_condition: {
        good: Number,
        require_minor_repair: Number,
        require_major_repair: Number,
      },
      electricity: Boolean,
      internet: Boolean,
      computer_lab: Boolean,
      number_of_computers: Number,
      library: {
        available: Boolean,
        books_count: Number,
      },
      playground: Boolean,
      boundary_wall: String,
      ramp_available: Boolean,
      kitchen_shed: Boolean,
    },

    toilets: {
      boys: {
        total: Number,
        functional: Number,
      },
      girls: {
        total: Number,
        functional: Number,
      },
      cwsn: {
        total: Number,
        functional: Number,
        ramp_accessible: Boolean,
      },
    },

    water_facility: {
      drinking_water_available: Boolean,
      source: String,
    },

    mid_day_meal: {
      provided: Boolean,
      cooked_on_premises: Boolean,
      meal_days_per_week: Number,
    },

    classes_offered: [String],
    pta_meetings_last_year: Number,

    school_inspection: {
      last_inspected_on: Date,
      inspected_by: String,
      remarks: String,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "School",
      enum: ["School"],
    },
  },
  { timestamps: true } // includes createdAt and updatedAt
);

// 🔐 Hash password before saving
SchoolSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔑 Compare password method
SchoolSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("School", SchoolSchema);
