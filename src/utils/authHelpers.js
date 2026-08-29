export const normalizeEmail = (email) => {
  return email.trim().toLowerCase();
};

export const normalizeNickname = (nickname) => {
  return nickname
    .trim()
    .replace(/\s+/g, " ");
};

export const makeNicknameSearchValue = (
  nickname
) => {
  return normalizeNickname(nickname)
    .toLowerCase();
};

export const validateNickname = (
  nickname
) => {
  const normalizedNickname =
    normalizeNickname(nickname);

  if (!normalizedNickname) {
    return "Please enter a nickname.";
  }

  if (normalizedNickname.length < 2) {
    return "Your nickname should contain at least 2 characters.";
  }

  if (normalizedNickname.length > 30) {
    return "Your nickname should contain no more than 30 characters.";
  }

  /**
   * Allows letters, numbers, spaces,
   * apostrophes, hyphens and underscores.
   */
  const validNicknamePattern =
    /^[A-Za-z0-9À-ÖØ-öø-ÿ' _-]+$/;

  if (
    !validNicknamePattern.test(
      normalizedNickname
    )
  ) {
    return "Use only letters, numbers, spaces, apostrophes, hyphens or underscores.";
  }

  return null;
};

export const validateEmail = (email) => {
  const normalizedEmail =
    normalizeEmail(email);

  if (!normalizedEmail) {
    return "Please enter your email address.";
  }

  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (
    !emailPattern.test(normalizedEmail)
  ) {
    return "Please enter a valid email address.";
  }

  return null;
};

export const validatePassword = (
  password
) => {
  if (!password) {
    return "Please enter a password.";
  }

  if (password.length < 8) {
    return "Your password should contain at least 8 characters.";
  }

  if (!/[a-z]/.test(password)) {
    return "Your password should include at least one lowercase letter.";
  }

  if (!/[A-Z]/.test(password)) {
    return "Your password should include at least one uppercase letter.";
  }

  if (!/[0-9]/.test(password)) {
    return "Your password should include at least one number.";
  }

  return null;
};

export const validatePasswordConfirmation = (
  password,
  confirmPassword
) => {
  if (!confirmPassword) {
    return "Please confirm your password.";
  }

  if (password !== confirmPassword) {
    return "The passwords do not match.";
  }

  return null;
};