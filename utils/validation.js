const regexPassword = /.{8,32}/;

module.exports.validationRegister = (
  username,
  email,
  password,
  confirmPassword
) => {
  const errors = {};

  //   Username
  if (username.trim() === "") {
    errors.username = "Username must not be empty";
  }

  //   Email
  if (email.trim() === "") {
    errors.email = "Email must not be empty";
  } else {
    const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      errors.email = "Email must be a valid email address";
    }
  }

  // password
  if (password === "") {
    errors.password = "Password must not be empty";
  } else if (password !== confirmPassword) {
    errors.password = "Password must match";
  } else if (!password.match(regexPassword)) {
    errors.password =
      "Password must be at least 8 characters long, but no more than 32";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validationLogin = (username, password) => {
  const errors = {};

  if (username.trim() === "") {
    errors.username = "Username must not be empty";
  }

  if (password === "") {
    errors.password = "Password must be not empty";
  } else if (!password.match(regexPassword)) {
    errors.password =
      "Password must be at least 8 characters long, but no more than 32";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
