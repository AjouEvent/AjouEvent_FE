import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignInPage from "./pages/SignInPage";
import EventPage from "./pages/EventPage";
import SignUpPage from "./pages/SignUpPage";
import MainPage from "./pages/MainPage";
import EventDetailPage from "./pages/EventDetailPage";

const ROUTER = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
  },
  {
    path: "/signIn",
    element: <SignInPage />,
  },
  {
    path: "/signUp",
    element: <SignUpPage />,
  },
  {
    path: "/events",
    element: <EventPage />,
  },
  {
    path: "/event/:id",
    element: <EventDetailPage />,
  },
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={ROUTER} />
    </div>
  );
}

export default App;
