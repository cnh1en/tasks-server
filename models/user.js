import mongoose from "mongoose";
import uuidApiKey from "uuid-apikey";
const TYPE_ADMIN = "admin",
  TYPE_SDE = "sde",
  TYPE_NORMAL = "normal";
const STATUS_ACTIVE = "active",
  STATUS_PENDING = "pending",
  STATUS_DELETED = "deleted",
  STATUS_DISABLED = "disabled";

const GENDER_FEMALE = "female",
  GENDER_MALE = "male",
  GENDER_NONE = "none";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      minlength: 3,
      maxlength: 100,
      required: true,
    },
    profile: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      bcrypt: true,
    },
    usertype: {
      type: String,
      required: true,
      enum: [TYPE_ADMIN, TYPE_SDE, TYPE_NORMAL],
    },
    status: {
      type: String,
      required: true,
      enum: [STATUS_ACTIVE, STATUS_PENDING, STATUS_DISABLED, STATUS_DELETED],
      default: STATUS_PENDING,
    },
    api_key: {
      type: String,
      required: true,
      unique: true,
      default: uuidApiKey.create().apiKey,
    },
    date: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
      maxlength: 100,
    },
    tasks: {
      type: Number,
      enum: 0,
    },
    task_complete: {
      type: Number,
      enum: 0,
    },
    phone: {
      type: String,
      required: true,
      maxlength: 12,
    },
    gender: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, collection: "users" }
);

// Static Method's
userSchema.statics.findByEmail = async function (email) {
  let user = await this.findOne({ email: email });
  return user;
};
userSchema.statics.TYPE_ADMIN = TYPE_ADMIN;
userSchema.statics.TYPE_NORMAL = TYPE_NORMAL;
userSchema.statics.TYPE_SDE = TYPE_SDE;
userSchema.statics.STATUS_ACTIVE = STATUS_ACTIVE;
userSchema.statics.STATUS_PENDING = STATUS_PENDING;
userSchema.statics.STATUS_DELETED = STATUS_DELETED;
userSchema.statics.STATUS_DISABLED = STATUS_DISABLED;
userSchema.statics.GENDER_FEMALE = GENDER_FEMALE;
userSchema.statics.GENDER_MALE = GENDER_MALE;
userSchema.statics.GENDER_NONE = GENDER_NONE;

const User = mongoose.model("User", userSchema);
export default User;
