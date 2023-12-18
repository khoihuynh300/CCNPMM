import axios from "axios";
import { axiosJWT } from "./userService";

export const createCategory = async (name, access_token) => {
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_API_URL}/category/create`,
    { name: name },
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const updateCategory = async (id, name, access_token) => {
  const res = await axiosJWT.put(
    `${process.env.REACT_APP_API_URL}/category/update/${id}`,
    { name: name },
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const deleteCategory = async (id, access_token) => {
  const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/category/delete/${id}`, {
    headers: {
      token: `Bearer ${access_token}`,
    },
  });
  return res.data;
};

export const getAllCategory = async () => {
  const res = await axios.get(`${process.env.REACT_APP_API_URL}/category/get-all`);
  return res.data;
};

export const getCategoryDetail = async (id) => {
  const res = await axios.get(`${process.env.REACT_APP_API_URL}/category/get-details/${id}`);
  return res.data;
};
