import React from "react";
import "./navbar.css";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";

function Navbar({ dark, setDark }) {
  let navigate = useNavigate();
  let dispatch = useDispatch();
  const { name } = useSelector((state) => state.auth);
  const handlelogout = () => {
    dispatch(logout());

    navigate("/");
  };
  return (
    <header className="header">
      <div className="name-header">
        <h1 className="name-header-place button-91">{name}</h1>
      </div>
      <div className="logo">
        <h3 style={{ margin: "20px",color:"#ffff" }}>PDF Extractor</h3>
      </div>
      <div className="toggle-and-logout">
        <div>
          {dark ? (
            <i
              className="fa-solid fa-sun fa-2x"
              style={{ color: "rgb(250,189,5)", cursor: "pointer" }}
              onClick={() => setDark(!dark)}
            ></i>
          ) : (
            <i
              onClick={() => setDark(!dark)}
              className="fa-solid fa-moon fa-2x"
              style={{ color: "rgb(0,1,32)", cursor: "pointer" }}
            ></i>
          )}
        </div>

        <ul className="main-nav">
          <li>
            <button
              type="button"
              className="btn btn-warning"
              onClick={handlelogout}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Navbar;
