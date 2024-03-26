import React from "react";
import "./page.css";

function Pages(props) {
  const { arr, handle, handleDownloadPage, emptyArray } = props;
  console.log(arr);

  return (
    <div className="sticky-pages-box">
      <i
        id="cancel-mark-page"
        className="fa-solid fa-xmark fa-beat fa-3x"
        onClick={emptyArray}
      ></i>
      <div className="sticky-pages-flex">
        <h1 className="sticky-pages-flex-head">Selected Pages</h1>
        <ul className="list-design">
          {arr.length > 0
            ? arr.map((cur, idx) => {
                return <li key={idx}>{cur + 1}</li>;
              })
            : null}
        </ul>
        <button class="button-24" onClick={handle}>
          Extract
        </button>
        <button class="button-28" onClick={handleDownloadPage}>
          Download
        </button>
      </div>
    </div>
  );
}

export default Pages;
