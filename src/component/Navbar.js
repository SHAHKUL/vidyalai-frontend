import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar({ dark, setDark }) {
  let navigate = useNavigate();
  const handlelogout = () => {
    window.localStorage.removeItem("vidyalai");
    navigate("/");
  };
  return (
    <header class="header">
      <h1 class="logo">
        <h3 style={{ margin: "20px" }}>PDF Extractor</h3>
      </h1>
      <div style={{ marginLeft: "1200px" }}>
        {dark ? (
          <i
            class="fa-solid fa-sun fa-2x"
            style={{ color: "rgb(250,189,5)", cursor: "pointer" }}
            onClick={() => setDark(!dark)}
          ></i>
        ) : (
          <i
            onClick={() => setDark(!dark)}
            class="fa-solid fa-moon fa-2x"
            style={{ color: "rgb(0,1,32)", cursor: "pointer" }}
          ></i>
        )}
      </div>

      <ul class="main-nav">
        <li>
          <button type="button" class="btn btn-warning" onClick={handlelogout}>
            Logout
          </button>
        </li>
      </ul>
    </header>
  );
}

export default Navbar;
