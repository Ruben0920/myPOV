const passwordValidator = (password: string, confirm: string) => {
  if (!password) {
    return "Password is required."
  } else if (password.length < 6 || password.length > 16) {
    return "Password must be between 6 and 15 characters."
  } else if (password != confirm) {
    
    return "Passwords do not match."
  } else {
    return ""
  }
}

const emailValidator = (email: string) => {
  if (!email) {
    return "Email is required."
  } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return "Email is invalid."
  } else {
    return ""
  }
}

const usernameValidator = (username: string) => {
  if (!username) {
    return "Username is required."
  } else {
    return ""
  }
}

export default {
  usernameValidator,
  emailValidator,
  passwordValidator,
}
