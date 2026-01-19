import API from "./axiosClient";

const usersApi = {
  // LIST ALL USERS
  getUsers: () =>
    API.get("auth/view/"),

  // UPDATE USER STATUS
  updateStatus: (id, status) =>
    API.patch(`auth/${id}/status/`, { status }),

  // DELETE USER
  deleteUser: (id) =>
    API.delete(`auth/${id}/delete/`),
};

export default usersApi;
