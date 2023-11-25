import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";

import routes from "./routes";
import DefaultComponent from "./components/DefaultComponent/DefaultComponent";
import { updateUser } from "./redux/slices/userSlice";
import * as userService from "./services/userService";
function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    if (access_token !== "undefined") {
      const decoded = handleDecoded(access_token);
      if (decoded?.id) {
        handleGetDetailUser(decoded?.id, access_token);
      }
    }
  }, []);

  const handleGetDetailUser = async (id, access_token) => {
    const res = await userService.getDetailUser(id, access_token);
    dispatch(updateUser({ ...res?.data, access_token }));
  };

  const handleDecoded = (access_token) => {
    let decoded = {};
    if (access_token) {
      decoded = jwtDecode(access_token);
    }
    return decoded;
  };

  userService.axiosJWT.interceptors.request.use(
    async (config) => {
      const access_token = localStorage.getItem("access_token");
      const currentTime = new Date();
      const decoded = handleDecoded(access_token);
      console.log("access token expire in", decoded?.exp - currentTime.getTime() / 1000);
      if (decoded?.exp < currentTime.getTime() / 1000) {
        const data = await userService.refreshToken();
        localStorage.setItem("access_token", data?.access_token);
        config.headers["token"] = `Bearer ${data?.access_token}`;
      }
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  return (
    <div>
      <Router>
        <Routes>
          {routes.map((route) => {
            const Page = route.component;
            const Layout = route.showHeader ? DefaultComponent : Fragment;
            return (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
