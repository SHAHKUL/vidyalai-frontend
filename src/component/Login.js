import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";

import { useFormik } from "formik";

import axios from "axios";
function Login() {
  const [err, setErr] = useState("");
  let navigate = useNavigate();
  let formik = useFormik({
    initialValues: {
      email: "",
      pass: "",
    },
    onSubmit: async (val) => {
      try {
        var res = await axios.post(`https://vidyalai-code.onrender.com/login`, val);
        window.localStorage.setItem("vidyalai", res.data.token);
        if (res.data.token) {
          navigate("/home");
        } else {
          console.log(res.data.message);
          setErr(res.data.message);
        }
      } catch (error) {}
    },
  });
  return (
    <div className="body-login">
      <div class="container-login">
        <div class="brand-logo-login">
          <img
            className="image"
            src="https://react-pdf.org/images/logo.png"
          ></img>
        </div>
        <div class="brand-title-login">PDf-Extractor</div>
        <h1 style={{ color: "#B32624" }}>Login</h1>
        <form className="form-login" onSubmit={formik.handleSubmit}>
          <div class="inputs-login">
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
