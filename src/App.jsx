import { Route, Routes } from "react-router-dom";
import { publicPaths } from "./constances/paths";
import PublicLayout from "./pages/public/PublicLayout";
import Home from "./pages/public/home/Home";
import Login from "./pages/public/auth/Login";
import Register from "./pages/public/auth/Register";

function App() {
  return (
    <div className="relative h-full w-full overflow-auto">
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route element={<Home />} />
          <Route path={publicPaths.LOGIN} element={<Login />} />
          <Route path={publicPaths.REGISTER} element={<Register />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
