import React, { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import axios from "axios";
import { PDFDocument } from "pdf-lib";
import swal from "sweetalert";
import { useSelector } from "react-redux";
import ControlPanel from "../controlpanel/Controlpanel";

import Cards from "../card/Cards";
import Popup from "../popup/Popup";
import { Url } from "../../Url";

import Pages from "../pages/Pages";
import "./homepage.css";

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
  const [arr, setArr] = useState([]);
  const [log, setLog] = useState(false);
  const { token } = useSelector((state) => state.auth);

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
      console.log("please select");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pdf !== null) {
      setView(pdf);
      await axios.post(
        `${Url}/pdf/create`,
        {
          name: title,
          files: pdf,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            auth: token,
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
  }, []);

  const fetch = async () => {
    try {
      setLog(true);
      const res = await axios.get(`${Url}/pdf/get`, {
        headers: {
          auth: token,
        },
      });
      setLog(false);
      setList(res.data);
      setArr([]);
    } catch (error) {
      console.log(error);
    }
  };
  const handleView = async (ide) => {
    try {
      setLog(true);
      var res = await axios.get(`${Url}/pdf/get/${ide}`, {
        headers: {
          auth: token,
        },
      });
      setLog(false);
      setToggle(res.data);
      setArr([]);
      setTitle("");
      //////////////////url pasete in popup//////////////////
      dataURLtoBlob(res.data.file);
      setView(false);
      fetch();
    } catch (error) {
      console.log(error);
    }
  };
  const handleDelete = (id) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, your PDF Will not be able to recoverd !!!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        setLog(true);
        axios.delete(`${Url}/pdf/delete/${id}`, {
          headers: {
            auth: token,
          },
        });
        fetch();
        setLog(false);

        swal("Poof! Your  file has been deleted Successfully!!", {
          icon: "success",
        });
      } else {
        swal("Your PDF file is safe!");
      }
    });
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
    const newPdfDoc = await extractPdfPage(pdfArrayBuffer, from, to);
    renderPdf(newPdfDoc);
  };

  async function extractPdfPage(arrayBuff, m, n) {
    const pdfSrcDoc = await PDFDocument.load(arrayBuff);
    const pdfNewDoc = await PDFDocument.create();
    const pages = await pdfNewDoc.copyPages(
      pdfSrcDoc,
      from ? range(m, n) : arr
    );
    pages.forEach((page) => pdfNewDoc.addPage(page));
    const newpdf = await pdfNewDoc.save();
    return newpdf;
  }

  function range(start, end) {
    let length = end - start + 1;
    return Array.from({ length }, (_, i) => start + i - 1);
  }

  const specficPages = (val) => {
    var str = arr.indexOf(val);

    if (str === -1) {
      setFrom("");
      return setArr([...arr, val]);
    } else {
      setFrom("");
      arr.splice(str, 1);
      return setArr([...arr]);
    }
  };
  const emptyArray = () => {
    setArr([]);
  };

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
    // Create a link element to trigger the download
    const link = document.createElement("a");
    link.href = `${pdfPath}#page=${targetPageNumber}`;
    link.download = `page_${targetPageNumber}.pdf`; // Customize the downloaded file name
    link.click();
  };

  return (
    <div>
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="form-box">
            <h3>Title</h3>
            <input
              className="form-control"
              type="text"
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              className="form-control"
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
              {multi ? "Multi Page" : "Single Page"}
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
          <div className="left-box"></div>
          {/* ////////////////////center-box-229////// */}
          <div className="center-box">
            <div className="alingment">
              <div className="sticky-pages">
                {arr.length > 0 ? (
                  <Pages
                    arr={arr}
                    handle={handle}
                    handleDownloadPage={handleDownloadPage}
                    emptyArray={emptyArray}
                  />
                ) : null}
              </div>
              <div style={{display:'flex',justifyContent:"flex-start"}}>
              <h1
                className="alingment-head"
                style={{
                  color: dark ? "#FFFFFF" : "#000000",
                }}
              >
                {title ? title : toggle.name}
              </h1>
              </div>
            </div>
            <Document
              className="no-pdf"
              file={view ? view : toggle.file}
              onLoadSuccess={onDocumentLoadSuccess}
            >
              {multi ? (
                <div className="pdf">
                  <Page
                    width={800}
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
                    <span className="check">
                      <button
                        onClick={() => specficPages(idx)}
                        className="check-button"
                      >
                        <input type="checkbox" className="checkbox-button" />
                      </button>
                    </span>
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
              {list?.map((cur) => {
                return (
                  <div key={cur._id}>
                    <Cards
                      key={cur._id}
                      cur={cur}
                      onDocumentLoadSuccess={onDocumentLoadSuccess}
                      pageNumber={pageNumber}
                      handleView={handleView}
                      handleRemove={handleDelete}
                    />
                  </div>
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
        {log && (
          <span className="main-book-two">
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
      </div>
    </div>
  );
};

export default PDFViewer;
