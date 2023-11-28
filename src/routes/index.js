import DefaultLayout from "../layouts/DefaultLayout";

import {
  HomePage,
  DetailPage,
  FavouritePage,
  LoginPage,
  SignUpPage,
  UploadPage,
  MyUploadPage,
} from "../pages";

const publicRoutes = [
  { path: "/", component: HomePage, layout: DefaultLayout },
  { path: "/login", component: LoginPage },
  { path: "/signup", component: SignUpPage },
  { path: "/detail/:id", component: DetailPage, layout: DefaultLayout },
];

const privateRoutes = [
  { path: "/favourite", component: FavouritePage, layout: DefaultLayout },
  { path: "/upload", component: UploadPage, layout: DefaultLayout },
  { path: "/myupload", component: MyUploadPage, layout: DefaultLayout },
];

export { publicRoutes, privateRoutes };
