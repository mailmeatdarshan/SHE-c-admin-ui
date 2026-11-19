import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Loginpage from "./pages/login/login";
import SectionPlaceholder from "./pages/SectionPlaceholder";
import Users from "./pages/users/Users";
import Dashboard from "./layouts/Dashboard";
import NonAuth from "./layouts/NonAuth";
import Root from "./layouts/Root";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "",
        element: <Dashboard />,
        children: [
          {
            path: "",
            element: <HomePage />,
          },
          {
            path: "shop",
            element: (
              <SectionPlaceholder
                title="Shop"
                description="Manage dealer shops, storefronts, and branch inventory."
              />
            ),
          },
          {
            path: "orders",
            element: (
              <SectionPlaceholder
                title="Orders"
                description="Track, fulfill, and manage incoming paint orders."
              />
            ),
          },
          {
            path: "products",
            element: (
              <SectionPlaceholder
                title="Products"
                description="Manage paint shades, finishes, pack sizes, and pricing."
              />
            ),
          },
          {
            path: "users",
            element: <Users />,
          },
          {
            path: "analytics",
            element: (
              <SectionPlaceholder
                title="Analytics"
                description="Sales trends, top-selling shades, and dealer performance."
              />
            ),
          },
          {
            path: "promos",
            element: (
              <SectionPlaceholder
                title="Promos"
                description="Create seasonal offers, dealer rebates, and discount codes."
              />
            ),
          },
          {
            path: "settings",
            element: (
              <SectionPlaceholder
                title="Settings"
                description="Configure company profile, billing, and system preferences."
              />
            ),
          },
        ],
      },
      {
        path: "/auth",
        element: <NonAuth />,
        children: [
          {
            path: "login",
            element: <Loginpage />,
          },
        ],
      },
    ],
  },
]);
