export const checkPassword = (password: string): boolean => {
  return process.env.JWT_PASSWORD! === password;
};

export const getWhitelistedOrigins = (): string[] => {
  return process.env.WHITELISTED_ORIGINS!.split(",");
};

export const getJwtSecretKey = (): string => {
  return process.env.JWT_SECRET_KEY!;
};
