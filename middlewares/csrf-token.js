

// import { doubleCsrf } from "csrf-csrf";

// const { doubleCsrfProtection, generateToken } = doubleCsrf({
//   getSecret: () => "your-secret-key",
//   cookieName: "__Host-psifi.x-csrf-token",
//   cookieOptions: {
//     sameSite: "lax",
//     path: "/",
//     secure: true
//   },
//   size: 64,
//   ignoredMethods: ["GET", "HEAD", "OPTIONS"],
//   getTokenFromRequest: (req) => req.headers["x-csrf-token"],
//   errorConfig: {
//     statusCode: 403,
//     message: "invalid csrf token",
//     code: "EBADCSRFTOKEN"
//   }
// });

function addCsrfToken(req, res, next) {
  res.locals.csrfToken = req.csrfToken();
  
  next();
}

export default addCsrfToken;

