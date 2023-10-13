import { Home } from "./pages/home/Home";
import { Login } from "./pages/login/Login";
import { Profile } from "./pages/profile/Profile";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { Register } from "./pages/register/Register";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Messenger from "./pages/messenger/Messenger";
import { Setting } from "./pages/setting/Setting";



function App() {
  const { user } = useContext(AuthContext);
  const router = createBrowserRouter([
    {
      path: "/",
      element: user? <Home /> : <Navigate to="/login"/>,
    },
    {
      path: "/login",
      element: user? <Navigate to="/" /> : <Login />,
    },
    {
      path: "/register",
      element:user? <Navigate to="/" /> : <Register/>,
    },
    {
      path: "/messenger",
      element: user? <Messenger/> : <Navigate to="/login" />,
    },
    {
      path: "/profile/:username",
      element: <Profile />,
    },
    {
      path: "/setting",
      element: user? <Setting/> : <Register/>
    }
  ]);
  return <RouterProvider router={router} />;
}

export default App;
