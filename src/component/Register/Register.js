import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import axios from "axios";
import { Url } from "../../Url";

const validate = (values) => {
  const errors = {};
  if (!values.name) {
    errors.name = "* Name field should not be empty";
  }

  if (!values.email) {
    errors.email = "* Email field should not be empty";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "* Enter Valid Email Id";
  }
  if (!values.password) {
    errors.password = "* Password field should not be empty";
  }

  return errors;
};

function Register() {
  const [val, setVal] = useState("");
  let navigate = useNavigate();
  let formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },

    validate,
    onSubmit: async (values) => {
      var res = await axios.post(`${Url}/user/register`, values);
      if (res.data.msg) {
        navigate("/");
      } else {
        setVal(res.data.message);
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
        <h1 style={{ color: "#B32624" }}>Register</h1>
        <form className="form-login" onSubmit={formik.handleSubmit}>
          <div className="inputs-login">
            <label className="label-login">Name</label>
            <input
              className="input-login"
              type="text"
              placeholder="Name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
            />
            <div style={{ color: "red", margin: "5px" }}>
              {formik.errors.name}{" "}
            </div>
            <label className="label-login">EMAIL</label>
            <input
              className="input-login"
              type="text"
              placeholder="example@test.com"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
            />
            <div style={{ color: "red", margin: "5px" }}>
              {formik.errors.email}{" "}
            </div>
            <label>PASSWORD</label>
            <input
              className="input-login"
              type="password"
              placeholder="Password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
            />
            <div style={{ color: "red", margin: "5px" }}>
              {formik.errors.password}{" "}
            </div>

            <button className="button-login" type="submit">
              Register
            </button>
            {val && <div style={{ color: "red", margin: "10px" }}>{val} </div>}
            <Link to={"/"}>
              <button className="button-login">Login</button>
            </Link>
            <div
              style={{ color: "#2557BB", margin: "5px", marginLeft: "40px" }}
            >
              If User already exist try to log in
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
