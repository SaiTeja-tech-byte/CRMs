// Turns a failed API call into a message that actually explains what
// happened, instead of always showing the same generic "couldn't load"
// text regardless of cause. This matters most for the 401/403 case: those
// mean "your account isn't set up right," not "something's broken," and
// the two need very different next steps from the person seeing them.
export const describeApiError = (err, fallback = "Something went wrong. Please try again.") => {
  if (!err?.response) {
    return "Couldn't reach the server. Check your connection and try again.";
  }

  const { status, data } = err.response;
  const serverMessage = data?.message;

  if (status === 401) {
    return "Your session has expired. Please log out and log back in.";
  }
  if (status === 403) {
    return serverMessage
      ? `Access denied: ${serverMessage} (your account may not be marked as admin in the database)`
      : "Access denied — your account isn't marked as admin. Ask a database admin to check your role.";
  }
  if (status === 404) {
    return "That wasn't found on the server — it may have been deleted already.";
  }
  if (status >= 500) {
    return serverMessage
      ? `Server error: ${serverMessage}`
      : "The server hit an error processing this. Try again in a moment.";
  }

  return serverMessage || fallback;
};
