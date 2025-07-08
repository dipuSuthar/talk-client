import axios from "axios";
import GenericError from "./GenericError";

const token = sessionStorage.getItem("key");
export const GetAuthorizedApi = async (url, data) => {
  return await axios
    .post(url, data, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 8000,
    })
    .then((response) => {
      console.log(response.data);
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      GenericError(error);
    });
};
export const GetAuthorizedTokenApi = async (url, data) => {
  return await axios
    .post(url, data, {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer${token}`,
      },
      timeout: 8000,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      GenericError(error);
    });
};
