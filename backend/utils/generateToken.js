import jwt from 'jsonwebtoken';

const generateRefreshToken = async (res, user) => {

  let refresh_token

  const existing_refresh_token = user.refresh_token

  if (existing_refresh_token){
    refresh_token = existing_refresh_token
  }else{
    refresh_token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
    user.refresh_token = refresh_token
    await user.save()
  }
  
  res.cookie('refresh_token', refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
    sameSite: 'strict', // Prevent CSRF attacks
  });
};

export default generateRefreshToken;
