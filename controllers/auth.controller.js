import User from "../models/user.model.js";
import authUtil from "../util/authentication.js";
import validation from "../util/validation.js";
import sessionFlash from "../util/session-flash.js";

function getSignup(req, res) {
  let sessionData = sessionFlash.getSessionData(req);

  if (!sessionData) {
    sessionData = {
      email: "",
      confirmEmail: "",
      password: "",
      fullname: "",
      street: "",
      postal: "",
      city: "",
    };
  }

  res.render("customer/auth/signup", {inputData: sessionData});
}

async function signup(req, res, next) {
  const enteredData = {
    email: req.body.email,
    confirmEmail: req.body["confirm-email"],
    password: req.body.password,
    fullname: req.body.fullname,
    street: req.body.street,
    postal: req.body.postal,
    city: req.body.city,
  };

  if (
    !validation.userDetailsAreValid(
      req.body.email,
      req.body.password,
      req.body.fullname,
      req.body.street,
      req.body.postal,
      req.body.city
    ) ||
    !validation.emailIsConfirmed(req.body.email, req.body["confirm-email"])
  ) {
    sessionFlash.flashDataToSession(
      req,
      {
        errorMessage: "패스워드는 최소 6글자 이상이어야 합니다.",
        ...enteredData,
      },
      () => {
        res.redirect("/signup");
      }
    );
    return;
  }

  const user = new User(
    req.body.email,
    req.body.password,
    req.body.fullname,
    req.body.street,
    req.body.postal,
    req.body.city
  );

  try {
    const existsAlready = await user.existsAlready();

    if (existsAlready) {
      sessionFlash.flashDataToSession(
        req,
        {
          errorMessage: "이미 존재하는 유저입니다.",
          ...enteredData,
        },
        () => {
          res.redirect("/signup");
        }
      );
      return;
    }
    await user.signup();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect("/login");
}

function getLogin(req, res) {
  let sessionData = sessionFlash.getSessionData(req);

  if(!sessionData){
    sessionData = {
      email: '',
      password: ''
    }
  }

  res.render("customer/auth/login", {inputData: sessionData});
}

async function login(req, res) {
  const user = new User(req.body.email, req.body.password);
  let existingUser;

  try {
    existingUser = await user.getUserWithSameEmail();
  } catch (error) {
    next(error);
    return;
  }

  const sessionErrorData = {
    errorMessage: "이메일이나 비밀번호를 다시 확인하세요",
    email: user.email,
    password: user.password,
  };

  if (!existingUser) {
    sessionFlash.flashDataToSession(req, sessionErrorData, () => {
      res.redirect("/login");
    });
    return;
  }

  const passwordIsCorrect = await user.hasMatchingPassword(
    existingUser.password
  );

  if (!passwordIsCorrect) {
    sessionFlash.flashDataToSession(req, sessionErrorData, () => {
      res.redirect("/login");
    });
    return;
  }

  authUtil.createUserSession(req, existingUser, () => {
    res.redirect("/");
  });
}

function logout(req, res) {
  authUtil.destroyUserAuthSession(req);
  res.redirect("/login");
}

export default { getSignup, getLogin, signup, login, logout };
