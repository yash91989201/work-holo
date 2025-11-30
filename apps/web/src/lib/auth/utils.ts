const alreadyExistsCodes = new Set([
  "USER_ALREADY_EXISTS",
  "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL",
]);

export type AuthClientError = {
  code?: string | null;
  message?: string | null;
} | null;

export function isUserAlreadyExistsError(error: AuthClientError) {
  if (error === null) {
    return false;
  }

  const code = error.code ?? "";

  if (alreadyExistsCodes.has(code)) {
    return true;
  }

  const message = error.message?.toLowerCase() ?? "";

  return message.includes("already exists");
}
