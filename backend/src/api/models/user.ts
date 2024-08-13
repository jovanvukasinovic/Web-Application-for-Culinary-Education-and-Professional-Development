import mongoose from "mongoose";
// import autoIncrement from "mongoose-auto-increment";

const Schema = mongoose.Schema;

let User = new Schema(
  {
    id: { type: Number, unique: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    photo: {
      data: Buffer,
      contentType: String,
    },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    role: { type: String, default: "user" },
    status: { type: String, default: "inactive" },
    // favourites: [Recipe] ?
    // food_made: [Recipe] ?
    // likes: ???
    // comments: ???
    // date created: ???
  },
  { timestamps: true }
);

/** 
User.plugin(autoIncrement.plugin, {
  model: "User",
  field: "id",
  startAt: 1,
  incrementBy: 1,
});
*/

export default mongoose.model("User", User, "users");

// const User = mongoose.model('User', UserSchema);
// export default User;
