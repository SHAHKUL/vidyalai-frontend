import React from "react";
import "./popup.css";
function Popup(props) {
  const { show, setShow, setFrom, setTo, handle, handleDownloadPage } = props;
  return (
    <div className="logic">
      <i
        id="cancel-mark"
        className="fa-solid fa-xmark fa-beat fa-3x"
        onClick={() => setShow(!show)}
      ></i>

      <form className="popup-form" onSubmit={(e) => e.preventDefault()}>
        <input
          type="number"
          placeholder="From"
          onChange={(e) => setFrom(Number(e.target.value))}
        />
        <input
          type="number"
          placeholder="To"
          onChange={(e) => setTo(Number(e.target.value))}
        />
        <button className="fa-beat popup-button" onClick={handle}>
          Extract
        </button>
      </form>
      <i
        id="download"
        onClick={handleDownloadPage}
        className="fa-solid fa-circle-down fa-3x fa-bounce"
      ></i>
    </div>
  );
}

export default Popup;
