import mongoose from "mongoose";

const Schema = mongoose.Schema;

let User = new Schema({
  id: String,
  firstname: String,
  lastname: String,
  photo: {
    data: Buffer,
    contentType: String,
  },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: String,
  phone: String,
  role: String,
  active: Boolean,
  // favourites: [Recipe] ?
  // food_made: [Recipe] ?
  // likes: ???
  // comments: ???
  // date created: ???
});

export default mongoose.model("User", User, "users");

// const User = mongoose.model('User', UserSchema);
// export default User;
