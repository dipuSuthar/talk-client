import axios from "axios";

const GenericError = (error) => {
  const errorList = [];

  if (axios.isCancel(error) || error.message?.includes("timeout")) {
    // Request canceled or timeout exceeded
    throw new Error("Request canceled or timed out. Please try again.");
  } else if (error.message === "Network Error") {
    throw new Error("Network issue detected. Please check your connection.");
  } else if (error.response) {
    const status = error.response.status;
    const serverMessage =
      error.response.data?.message || "An unexpected server error occurred.";

    // Handle specific status codes
    switch (status) {
      case 400:
        if (
          serverMessage === "Validation Failed" &&
          Array.isArray(error.response.data?.details)
        ) {
          error.response.data.details.forEach((detail) => {
            errorList.push(detail);
          });
          throw { isListError: true, errorDetails: errorList };
        } else {
          throw new Error(serverMessage || "Bad Request.");
        }

      case 401:
        throw new Error(error.response.data.message);

      case 403:
        throw new Error("You do not have permission to perform this action.");

      case 404:
        throw new Error("Requested resource not found.");

      case 500:
        throw new Error("Internal Server Error. Please try again later.");

      default:
        throw new Error(serverMessage);
    }
  } else if (error.request) {
    // Request made but no response received
    throw new Error(
      "No response received from the server. Please try again later."
    );
  } else {
    // Something went wrong setting up the request
    throw new Error("An unexpected error occurred during the request setup.");
  }
};

export default GenericError;
