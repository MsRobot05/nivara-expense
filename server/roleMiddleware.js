const { createClient } = require("@supabase/supabase-js");

function requireRole(...allowedRoles) {
  return async function (req, res, next) {
    if (!req.user?.id || !req.accessToken) {
      return res.status(401).json({
        error: "Authentication required.",
      });
    }

    try {
      const userSupabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY,
        {
          global: {
            headers: {
              Authorization: `Bearer ${req.accessToken}`,
            },
          },
        }
      );

      const { data, error } = await userSupabase
        .from("profiles")
        .select("role")
        .eq("id", req.user.id)
        .maybeSingle();

      if (error) {
        console.error("Role lookup failed:", error.message);
        return res.status(500).json({
          error: "Could not verify user permissions.",
        });
      }

      if (!data || !allowedRoles.includes(data.role)) {
        return res.status(403).json({
          error: "You do not have permission to perform this action.",
        });
      }

      req.userRole = data.role;
      req.userSupabase = userSupabase;

      return next();
    } catch (error) {
      console.error("Role check failed:", error.message);
      return res.status(500).json({
        error: "Could not verify user permissions.",
      });
    }
  };
}

module.exports = { requireRole };