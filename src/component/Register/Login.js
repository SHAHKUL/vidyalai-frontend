import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";

import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { login } from "../redux/authSlice";

import axios from "axios";
import { Url } from "../../Url";
function Login() {
  const [err, setErr] = useState("");
  const [log, setLog] = useState(false);
  let navigate = useNavigate();
  const dispatch = useDispatch();
  let formik = useFormik({
    initialValues: {
      email: "",
      pass: "",
    },
    onSubmit: async (val) => {
      try {
        setLog(true);
        var res = await axios.post(`${Url}/user/login`, val);
        dispatch(login(res.data));

        if (res.data.token) {
          setLog(false);
          navigate("/home");
        } else {
          setErr(res.data.message);
          setLog(false);
        }
      } catch (error) {
        console.log(error);
      }
    },
  });
  return (
    <div className="body-login">
      <div className="container-login">
        <div className="brand-logo-login">
          <img
            className="image"
            src="https://react-pdf.org/images/logo.png"
            alt="pdf-extractor-logo"
          ></img>
        </div>
        <div className="brand-title-login">PDf-Extractor</div>
        <h1 style={{ color: "#B32624" }}>Login</h1>
        <form className="form-login" onSubmit={formik.handleSubmit}>
          <div className="inputs-login">
            <label className="label-login">EMAIL</label>
            <input
              className="input-login"
              placeholder="example@test.com"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
            />
            <label>PASSWORD</label>
            <input
              className="input-login"
              type="password"
              placeholder="Min 6 charaters long"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
            />
            <p style={{ color: "red" }}>{`${err}`}</p>
            {log && (
              <span className="main-book">
                <div className="full-book">
                  <div className="book">
                    <div className="book__pg-shadow"></div>
                    <div className="book__pg"></div>
                    <div className="book__pg book__pg--2"></div>
                    <div className="book__pg book__pg--3"></div>
                    <div className="book__pg book__pg--4"></div>
                    <div className="book__pg book__pg--5"></div>
                  </div>
                </div>
              </span>
            )}
            <button className="button-login" type="submit">
              Login
            </button>
            <Link style={{ textDecoration: "none" }} to={"/register"}>
              <button className="button-login" type="submit">
                Register
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
