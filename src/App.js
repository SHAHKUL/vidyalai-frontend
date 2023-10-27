import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./component/Login";
import Register from "./component/Register";
import Maincomponent from "./Maincomponent";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Maincomponent />} />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
