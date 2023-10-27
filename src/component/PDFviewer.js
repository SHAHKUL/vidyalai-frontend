import React, { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import axios from "axios";
import ControlPanel from "./Controlpanel";
import { PDFDocument } from "pdf-lib";
import Card from "./Card";
import Popup from "./Popup";

// Set the worker source to be used for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFViewer = ({ dark }) => {
  const [title, setTitle] = useState("");
  const [pdf, setPdf] = useState(null);
  const [view, setView] = useState(null);

  const [toggle, setToggle] = useState({});
  /////////////////////////////////////////////////
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState("");
  const [scale, setScale] = useState(1.0);

  //////////////////////////////////////////////////
  const [multi, setMulti] = useState(true);
  const [list, setList] = useState([]);
  const [mock, setmock] = useState(null);

  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);
  const [show, setShow] = useState(false);

  const [pdfFileData, setPdfFileData] = useState();
  ////////////////////////////extracted data/////////
  const [extrlist, setextrlist] = useState([]);
  const [extr, setextr] = useState();

  const fileType = ["application/pdf"];
  const handlechange = (e) => {
    let selectFile = e.target.files[0];
    if (selectFile) {
      if (selectFile && fileType.includes(selectFile.type)) {
        let reader = new FileReader();
        reader.readAsDataURL(selectFile);
        reader.onload = () => {
          setPdf(reader.result);
        };
      } else {
        setPdf(null);
      }
    } else {
      console.log("please selcect");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pdf !== null) {
      setView(pdf);
      console.log(pdf);

      await axios.post(
        `https://vidyalai-code.onrender.com/create`,
        {
          name: title,
          files: pdf,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            auth: window.localStorage.getItem("vidyalai"),
          },
        }
      );
      fetch();
      dataURLtoBlob(pdf);
    } else {
      setView(null);
    }
  };

  useEffect(() => {
    fetch();
    fetchExtractedpdf();
  }, []);

  const fetch = async () => {
    const res = await axios.get(`https://vidyalai-code.onrender.com/get`, {
      headers: {
        auth: window.localStorage.getItem("vidyalai"),
      },
    });
    setList(res.data);
  };

  const handleDelete = async (id) => {
    await axios.delete(`https://vidyalai-code.onrender.com/delete/${id}`, {
      headers: {
        auth: window.localStorage.getItem("vidyalai"),
      },
    });

    fetch();
  };

  const handleView = async (ide) => {
    var res = await axios.get(`https://vidyalai-code.onrender.com/get/${ide}`, {
      headers: {
        auth: window.localStorage.getItem("vidyalai"),
      },
    });
    setToggle(res.data);
    setTitle("");
    //////////////////url pasete in popup//////////////////
    dataURLtoBlob(res.data.file);
    setView(!pdf);
    fetch();
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);

    setPageNumber(1);
  };

  //////////////////////////////converter url to blob/////////////////////
  function dataURLtoBlob(dataURL) {
    var reader = new FileReader();
    var byteString = atob(dataURL.split(",")[1]);

    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);

    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    var yourBlob = new Blob([ab], {
      type: "application/pdf",
    });
    reader.readAsArrayBuffer(yourBlob);
    reader.onload = () => {
      setmock(reader.result);
    };
  }

  ///////////////////////////main three logic//////////////////////////
  const handle = async () => {
    const pdfArrayBuffer = mock;
    console.log(pdfArrayBuffer);
    const newPdfDoc = await extractPdfPage(pdfArrayBuffer, from, to);
    renderPdf(newPdfDoc);
  };
  async function extractPdfPage(arrayBuff, m, n) {
    const pdfSrcDoc = await PDFDocument.load(arrayBuff);
    const pdfNewDoc = await PDFDocument.create();
    const pages = await pdfNewDoc.copyPages(pdfSrcDoc, range(m, n));
    pages.forEach((page) => pdfNewDoc.addPage(page));
    const newpdf = await pdfNewDoc.save();
    return newpdf;
  }

  function range(start, end) {
    let length = end - start + 1;
    return Array.from({ length }, (_, i) => start + i - 1);
  }

  function renderPdf(uint8array) {
    const tempblob = new Blob([uint8array], {
      type: "application/pdf",
    });
    console.log("array", tempblob);
    const docUrl = URL.createObjectURL(tempblob);
    console.log("URL", docUrl);
    setPdfFileData(docUrl);
  }

  //////////////////download button//////////

  const handleDownloadPage = () => {
    const targetPageNumber = toggle.name;
    const pdfPath = pdfFileData;
    console.log(pdfPath);
    // Create a link element to trigger the download
    const link = document.createElement("a");
    link.href = `${pdfPath}#page=${targetPageNumber}`;
    link.download = `page_${targetPageNumber}.pdf`; // Customize the downloaded file name
    link.click();
    extractedpdf(pdfFileData, targetPageNumber);
  };

  ////////////////////////////extracted pdf///////////////////////////////////////
  const extractedpdf = async (data, name) => {
    const tempblob = new Blob([data], {
      type: "application/pdf",
    });

    const blob = tempblob; // Your Blob object
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => {
      setextr(reader.result);
    };

    await axios.post(
      `https://vidyalai-code.onrender.com/extract/`,
      { name, file: extr },
      {
        headers: {
          auth: window.localStorage.getItem("vidyalai"),
        },
      }
    );
  };

  const fetchExtractedpdf = async () => {
    var res = await axios.get(`https://vidyalai-code.onrender.com/extract`, {
      headers: {
        auth: window.localStorage.getItem("vidyalai"),
      },
    });
    setextrlist(res.data);
    console.log(extrlist);
  };

  const handleRemove = async (id) => {
    await axios.delete(`https://vidyalai-code.onrender.com/delete/${id}`, {
      headers: {
        auth: window.localStorage.getItem("vidyalai"),
      },
    });
    fetchExtractedpdf();
  };

  return (
    <div>
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div class="form-box">
            <h3>Title</h3>
            <input
              class="form-control"
              type="text"
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              class="form-control"
              type="file"
              id="formFile"
              accept="application/pdf"
              onChange={handlechange}
            />
            <button type="submit" className="btn btn-success">
              View PDF
            </button>
          </div>
        </form>
        <div>
          <div className="control">
            <ControlPanel
              scale={scale}
              setScale={setScale}
              numPages={numPages}
              pageNumber={pageNumber}
              setPageNumber={setPageNumber}
              file={view}
            />

            <button
              className="btn btn-warning"
              onClick={() => setMulti(!multi)}
            >
              {multi ? "Multi Page" : "Single Page"}{" "}
            </button>
          </div>
          <button
            style={{
              background: dark ? "#FFFFFF" : "#000000",
              color: dark ? "#000000" : "#FFFFFF",
            }}
            className="extract fa-bounce"
            onClick={() => setShow(!show)}
          >
            Extract
          </button>
        </div>
        <div className="main-box">
          <div className="left-box">
            {/* <h1 style={{ color: dark ? "#FFFFFF" : "#000000" }}>Extracted</h1>
            <div style={{ height: "200px", width: "200px" }}>
              {extrlist === null
                ? " "
                : extrlist.map((cur) => {
                    return (
                      <>
                        <Card
                        key={cur._id}
                          cur={cur}
                          onDocumentLoadSuccess={onDocumentLoadSuccess}
                          pageNumber={pageNumber}
                          handleView={handleView}
                          handleRemove={handleRemove}
                        />
                      </>
                    );
                  })}
            </div> */}
          </div>
          {/* ////////////////////center-box-229////// */}
          <div className="center-box">
            <h1
              style={{
                position: "absolute",
                top: "550px",
                left: "720px",
                marginTop: "100px",
                color: dark ? "#FFFFFF" : "#000000",
              }}
            >
              {title ? title : toggle.name}
            </h1>

            <Document
              file={view ? view : toggle.file}
              onLoadSuccess={onDocumentLoadSuccess}
            >
              {multi ? (
                <div className="pdf">
                  <Page
                    width="800"
                    className="pdf-container"
                    pageNumber={pageNumber}
                    scale={scale}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                  />
                </div>
              ) : (
                Array.from(new Array(numPages), (el, idx) => (
                  <>
                    <div className="pdf-multi">
                      <Page
                        key={`page_${idx + 1}`}
                        pageNumber={idx + 1}
                        className="pdf-multi-page"
                        renderAnnotationLayer={false}
                        renderTextLayer={false}
                        scale={scale}
                      />
                    </div>
                  </>
                ))
              )}
              <p style={{ color: dark ? "#FFFFFF" : "#000000" }}>
                Page {pageNumber} of {numPages}
              </p>
            </Document>
          </div>
          {/* ////////////////////right-box////// */}
          <div className="right-box">
            <h1 style={{ color: dark ? "#FFFFFF" : "#000000" }}>Uploaded</h1>
            <div style={{ height: "200px", width: "200px" }} className="small">
              {list === null
                ? " "
                : list.map((cur) => {
                    console.log(cur);
                    return (
                      <>
                        <Card
                          key={cur._id}
                          cur={cur}
                          onDocumentLoadSuccess={onDocumentLoadSuccess}
                          pageNumber={pageNumber}
                          handleView={handleView}
                          handleRemove={handleDelete}
                        />
                      </>
                    );
                  })}
            </div>
          </div>
        </div>

        {show && (
          <div className="pop-up-box">
            <Popup
              show={show}
              setShow={setShow}
              setFrom={setFrom}
              setTo={setTo}
              handle={handle}
              handleDownloadPage={handleDownloadPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFViewer;
