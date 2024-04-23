import User from "../backend/models/userModel.js";
import connectDB from "../backend/config/db.js";

connectDB();
const create_test_user = async () => {
  const name = "Test User";
  const email = "test@user.com";
  const password = "1234";

  const user = await User.create({
    name,
    email,
    password,
  });
  await user.save();
  process.exit(0);
};
create_test_user();
export default create_test_user;
