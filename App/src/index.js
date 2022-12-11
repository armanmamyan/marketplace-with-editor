import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import CreateModel from "./pages/CreateModel";
import "./style.css";

const root = ReactDOM.createRoot(document.querySelector("#root"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/create-model",
    element: <CreateModel />,
  },
]);


root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
