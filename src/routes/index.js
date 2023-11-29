import DefaultLayout from "../layouts/DefaultLayout";

import {
  HomePage,
  DetailPage,
  LoginPage,
  SignUpPage,
  UploadPage,
  MyUploadPage,
  MyBuy,
  MySell
} from "../pages";

const publicRoutes = [
  { path: "/", component: HomePage, layout: DefaultLayout },
  { path: "/login", component: LoginPage },
  { path: "/signup", component: SignUpPage },
  { path: "/detail/:id", component: DetailPage, layout: DefaultLayout },
];

const privateRoutes = [
  { path: "/upload", component: UploadPage, layout: DefaultLayout },
  { path: "/my-books", component: MyUploadPage, layout: DefaultLayout },
  { path: "/my-buys", component: MyBuy, layout: DefaultLayout },
  { path: "/my-sells", component: MySell, layout: DefaultLayout },
];

export { publicRoutes, privateRoutes };

