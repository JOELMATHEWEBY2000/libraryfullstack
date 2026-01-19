import axiosClient from "./axiosClient";

/* ================= VIEW PROFILE ================= */
export const getProfile = () => {
  return axiosClient.get("/profiles/view/");
};

/* ================= ADD PROFILE ================= */
export const addProfile = (data) => {
  return axiosClient.post("/profiles/add/", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/* ================= UPDATE PROFILE ================= */
export const updateProfile = (data) => {
  return axiosClient.put("/profiles/update/", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/* ================= DELETE PROFILE ================= */
export const deleteProfile = () => {
  return axiosClient.delete("/profiles/delete/");
};
