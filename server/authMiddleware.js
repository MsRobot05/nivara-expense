
const supabase = require("./supabase");

async function authenticateUser(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Authentication required. Please sign in.",
    });
  }

  const accessToken = authHeader.slice(7);
req.accessToken = accessToken;
  try {
    // Verify the token with Supabase Auth.
    const { data, error } = await supabase.auth.getUser(accessToken);

    if (error || !data.user) {
      return res.status(401).json({
        error: "Invalid or expired access token.",
      });
    }

    req.user = data.user;
    next();
  } catch (error) {
    console.error("Authentication failed:", error.message);

    return res.status(401).json({
      error: "Could not authenticate this request.",
    });
  }
}

module.exports = { authenticateUser };
