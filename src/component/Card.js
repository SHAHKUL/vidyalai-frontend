import React from 'react'
import { Document, Page, pdfjs } from "react-pdf";

function Card(props) {
    const {cur,onDocumentLoadSuccess,pageNumber,handleView,handleRemove}=props
  return (
    <card>
    <Document
      file={cur.file}
      onLoadSuccess={onDocumentLoadSuccess}
    >
      <h4 style={{ background: "#E31837" }}>
        {cur.name}
      </h4>

      <Page
        width="200"
        height="200"
        pageNumber={pageNumber}
        // scale={scale}
        renderAnnotationLayer={false}
        renderTextLayer={false}
      />
    </Document>

    <span
      style={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <button
        style={{ background: "none", border: "none" }}
      >
        <i
          class="fa-regular fa-eye fa-fade"
          id="icon"
          onClick={() => handleView(cur._id)}
        ></i>
      </button>
      <button
        style={{ background: "none", border: "none" }}
      >
        <i
          class="fa-solid fa-trash-can fa-bounce"
          id="icon"
          onClick={() => handleRemove(cur._id)}
        ></i>
      </button>
    </span>
  </card>
  )
}

export default Card