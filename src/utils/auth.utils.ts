/**
 * Reads the outcome of GET /auth/check-email/:email.
 *
 * The backend now says whether an OTP was sent in `data.requiresOtp`. Older
 * backends encoded it in the body statusCode instead: 200 (new account) or
 * 401 (new device) meant "OTP sent", 201 meant "known device, ask for the
 * password". Both forms are accepted so the app works with either backend.
 *
 * Returns null when the response is none of those outcomes.
 */
export const getCheckEmailOutcome = (body: {
  statusCode?: number;
  data?: { type?: string; requiresOtp?: boolean } | null;
}): { requiresOtp: boolean; type?: string } | null => {
  const type = body?.data?.type;
  if (typeof body?.data?.requiresOtp === "boolean") {
    return { requiresOtp: body.data.requiresOtp, type };
  }
  if (body?.statusCode === 200 || body?.statusCode === 401) {
    return { requiresOtp: true, type };
  }
  if (body?.statusCode === 201) {
    return { requiresOtp: false, type };
  }
  return null;
};
