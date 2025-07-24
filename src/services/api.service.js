import axios from "../utils/axios-customize";

const registerUserAPI = (fullName, email, password, phone) => {
  const URL_BACKEND = "/api/v1/user/register";
  const data = {
    fullName: fullName,
    email: email,
    password: password,
    phone: phone,
  };
  const res = axios.post(URL_BACKEND, data);
  return res;
};

const loginUserAPI = (username, password) => {
  const URL_BACKEND = "/api/v1/auth/login";
  const data = {
    username: username,
    password: password,
    // delay: 2000,
  };
  const res = axios.post(URL_BACKEND, data);
  return res;
};
const callFetchAccount = () => {
  const URL_BACKEND = "/api/v1/auth/account";
  return axios.get(URL_BACKEND);
};
const callLogout = () => {
  const URL_BACKEND = "/api/v1/auth/logout";
  return axios.post(URL_BACKEND);
};
export { registerUserAPI, loginUserAPI, callFetchAccount, callLogout };
