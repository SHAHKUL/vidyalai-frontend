import React from "react";
import { useState } from "react";
import Navbar from "./component/Navbar";
import PDFViewer from "./component/PDFviewer";

function Maincomponent() {
  const [dark, setDark] = useState(false);
  return (
    <div className="App" style={{ background: dark ? "rgb(32,33,36)" : "" }}>
      <Navbar dark={dark} setDark={setDark} />
      <PDFViewer dark={dark} />
    </div>
  );
}

export default Maincomponent;
