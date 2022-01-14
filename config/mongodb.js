import mongoose from "mongoose";
const connect = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
    });
    console.log("Connected to databse");
  } catch (error) {
    console.log(error);
  }
};
export default connect;
