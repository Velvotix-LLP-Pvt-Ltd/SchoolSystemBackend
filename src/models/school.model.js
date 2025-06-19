const mongoose = require("mongoose");

const SchoolSchema = new mongoose.Schema({
//   School_Code: {       //important property
//     type: String,      // should this be included?
//     required: true,    
//     unique: true,
//   },
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
      enum: ["Urban", "Rural"],
    },
  },
  established_year: Number,
  school_category: String,
  school_type: String, // e.g., Boys, Girls, Co-educational
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
    cwsn: Number,  // Children with special needs
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
      available: Boolean,  //should be number or bool?
      functional: Boolean, // should be number or bool?
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

  last_updated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("School", SchoolSchema);
