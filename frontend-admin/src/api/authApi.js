import API from "./axiosClient";

const authApi = {
  // REGISTER
  register: (data) =>
    API.post("auth/register/admin/create/", data),

  // LOGIN
  login: (data) =>
    API.post("auth/login/", data),

  // REFRESH TOKEN
  refreshToken: (refresh) =>
    API.post("auth/token/refresh/", { refresh }),

  // PROFILE (logged-in user)
  profile: () =>
    API.get("auth/profile/"),
};

export default authApi;
