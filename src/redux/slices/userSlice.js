import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  id: "",
  name: "",
  email: "",
  phone: "",
  address: "",
  avatar: "",
  access_token: "",
  isAdmin: false,
};
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      const {
        _id = "",
        name = "",
        email = "",
        phone = "",
        address = "",
        avatar = "",
        isAdmin = false,
      } = action.payload;
      state.id = _id;
      state.name = name;
      state.email = email;
      state.address = address;
      state.phone = phone;
      state.avatar = avatar;
      state.access_token = localStorage.getItem("access_token") || "";
      state.isAdmin = isAdmin;
    },
    resetUser: (state) => {
      state.id = "";
      state.email = "";
      state.name = "";
      state.address = "";
      state.phone = "";
      state.avatar = "";
      state.access_token = "";
      state.isAdmin = false;
    },
  },
});

export const { updateUser, resetUser } = userSlice.actions;

export default userSlice.reducer;
