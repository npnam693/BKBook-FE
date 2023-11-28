import { Fragment } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { privateRoutes, publicRoutes } from "./routes";
import { SnackbarProvider } from "notistack";
import { styled } from "@mui/material";
import { UserState } from "./Context/UserProvider";
import { Navigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StyledSnackbarProvider = styled(SnackbarProvider)`
  &.SnackbarItem-contentRoot {
    font-size: 16px;
    padding: 10px;
    font-family: "Roboto", sans-serif;
  }
`;

function App() {
  const { userInfo } = UserState();
  console.log("alo");

  return (
    <StyledSnackbarProvider maxSnack={3} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
      <Router>
        <Routes>
          {publicRoutes.map((route, idx) => {
            let Layout = route.layout;
            const Page = route.component;
            if (!Layout) Layout = Fragment;
            return (
              <Route
                key={idx}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}

          {privateRoutes.map((route, idx) => {
            let Layout = route.layout;
            const Page = route.component;
            if (!Layout) Layout = Fragment;
            if (JSON.parse(localStorage.getItem("userInfo")) != null) {
              return (
                <Route
                  key={idx}
                  path={route.path}
                  element={
                    <Layout>
                      <Page />
                    </Layout>
                  }
                />
              );
            } else
              return (
                <Route key={idx + publicRoutes.length} path={route.path} element={<Navigate replace to="/login" />} />
              );
          })}
        </Routes>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </StyledSnackbarProvider>
  );
}

export default App;
