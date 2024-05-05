import { Schema, model, models } from "mongoose";

type ModelsType = {
  User: any;
};

export type UserType = {
  name: string;
  email: string;
  image: string;
};

const userSchema = new Schema({
  name: String,
  email: String,
  image: String,
  emailVerifield: Date,
});

export const User = (models as ModelsType)?.User || model("User", userSchema);
