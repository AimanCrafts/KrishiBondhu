const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, trim: true, unique: true, sparse: true },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
    },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["farmer", "business", "admin"],
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "pending", "suspended", "rejected"],
      default: "pending",
    },

    division: { type: String, default: "", trim: true },
    district: { type: String, default: "", trim: true },

    profile: {
      district: { type: String, default: "" },
      division: { type: String, default: "" },
      farmSize: { type: String, default: "" },
      soilType: { type: String, default: "" },
      bio: { type: String, default: "" },
    },

    farmData: {
      onboardingDone: { type: Boolean, default: false },

      currentCrop: {
        name: { type: String, default: "" },
        variety: { type: String, default: "" },
        plantedOn: { type: Date, default: null },
        areaAcres: { type: Number, default: 0 },
        fieldName: { type: String, default: "" },
      },

      plannedCrop: {
        name: { type: String, default: "" },
        plannedSowOn: { type: Date, default: null },
      },

      field: {
        soilType: { type: String, default: "" },
        irrigation: { type: String, default: "" },
        totalAcres: { type: Number, default: 0 },
      },
    },

    businessInfo: {
      companyName: { type: String, default: "" },
      businessType: { type: String, default: "" },
      tradeLicense: { type: String, default: "" },
      tin: { type: String, default: "" },
      employeeCount: { type: String, default: "" },
      annualTurnover: { type: String, default: "" },
      contactPerson: { type: String, default: "" },
      address: { type: String, default: "" },
    },

    documents: {
      licenseFile: {
        url: { type: String, default: "" },
        publicId: { type: String, default: "" },
      },
      tinFile: {
        url: { type: String, default: "" },
        publicId: { type: String, default: "" },
      },
      extraFile: {
        url: { type: String, default: "" },
        publicId: { type: String, default: "" },
      },
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const isHashed = this.password.startsWith("$2b$");
  if (!isHashed) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
