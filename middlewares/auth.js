import UserModel from "../models/user.js";

const apiKeyAuthVerify = async (req, res, next) => {
  let resBody = { success: false, message: "" };
  let apiKeyHead = req.header("X-API-Key") || req.body.api_key;

  if (!apiKeyHead) {
    resBody.message = "API Key authentication header required";
    return res.status(401).json(resBody); // Terminate
  }

  try {
    let user = await UserModel.findOne({ api_key: apiKeyHead });
    if (!user) {
      return res
        .status(400)
        .json({ ...resBody, message: "X-API-Key Invalid", apiKey: false });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(400).json({ ...resBody, error });
  }
};
export default apiKeyAuthVerify;
