import React from "react";
import { Link,useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import axios from "axios";




const validate = values => {
  const errors = {};
  if (!values.name) {
    errors.name = 'Required';
  } 



  if (!values.email) {
    errors.email = 'Required';
  }
   else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }
  if (!values.password) {
    errors.password = 'Required';
  } 

  return errors;
};

function Register() {
  let navigate=useNavigate()
  let formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },

validate,
    onSubmit: async(values) => {
   await axios.post(`https://vidyalai-code.onrender.com/register`, values);
  
   navigate('/')
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
        <h1 style={{ color: "#B32624" }}>Register</h1>
        <form className="form-login" onSubmit={formik.handleSubmit}>
          <div class="inputs-login">
            <label className="label-login">Name</label>
            <input
              className="input-login"
              type="text"
              placeholder="Name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
            />
            <div style={{ color: "red" }}>{formik.errors.name} </div>
            <label className="label-login">EMAIL</label>
            <input
              className="input-login"
              type="email"
              placeholder="example@test.com"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
            />
            <div style={{ color: "red" }}>{formik.errors.email} </div>
            <label>PASSWORD</label>
            <input
              className="input-login"
              type="password"
              placeholder="Password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
            />
            <div style={{ color: "red" }}>{formik.errors.password} </div>
         
              <button className="button-login" type="submit">
                Register
              </button>
        
            <Link to={"/"}>
              <button className="button-login" >
                Login
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
