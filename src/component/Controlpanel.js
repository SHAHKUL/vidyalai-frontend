import React from "react";
// import PDFPrinter from "./Pdfprinter";

const ControlPanel = (props) => {
  const { file, pageNumber, numPages, setPageNumber, scale, setScale } = props;

  const isFirstPage = pageNumber === 1;
  const isLastPage = pageNumber === numPages;

  const firstPageClass = isFirstPage ? "disabled" : "clickable";
  const lastPageClass = isLastPage ? "disabled" : "clickable";

  const goToFirstPage = () => {
    if (!isFirstPage) setPageNumber(1);
  };
  const goToPreviousPage = () => {
    if (!isFirstPage) setPageNumber(pageNumber - 1);
  };
  const goToNextPage = () => {
    if (!isLastPage) setPageNumber(pageNumber + 1);
  };
  const goToLastPage = () => {
    if (!isLastPage) setPageNumber(numPages);
  };

  const onPageChange = (e) => {
    const { value } = e.target;
    setPageNumber(Number(value));
  };

  const isMinZoom = scale < 1.0;
  const isMaxZoom = scale >= 2.5;

  const zoomOutClass = isMinZoom ? "disabled" : "clickable";
  const zoomInClass = isMaxZoom ? "disabled" : "clickable";

  const zoomOut = () => {
    if (!isMinZoom) setScale(scale - 0.1);
  };

  const zoomIn = () => {
    if (!isMaxZoom) setScale(scale + 0.1);
  };

  return (
    <div className="control-panel" style={{ background: "#E31837" }}>
      <div style={{ background: "#E31837" }}>
        <i
          className={`fa-solid fa-backward-fast ${firstPageClass}`}
          onClick={goToFirstPage}
          style={{ marginRight: "15px", background: "#E31837" }}
        />

        <i
          className={`fa-solid fa-backward ${firstPageClass}`}
          onClick={goToPreviousPage}
          style={{ marginRight: "15px", background: "#E31837" }}
        />
        <span style={{ background: "#E31837" }}>
          Page{" "}
          <input
            name="pageNumber"
            type="number"
            min={1}
            max={numPages || 1}
            className="p-0 pl-1 mx-2"
            value={pageNumber}
            onChange={onPageChange}
          />{" "}
          of {numPages}
        </span>
        <i
          className={`fa-solid fa-forward mx-3 ${lastPageClass}`}
          onClick={goToNextPage}
          style={{ background: "#E31837" }}
        />
        <i
          className={`fa-solid  fa-fast-forward mx-3 ${lastPageClass}`}
          onClick={goToLastPage}
          style={{ background: "#E31837" }}
        />
      </div>
      <div style={{ background: "#E31837" }}>
        <i
          className={`fa-solid  fa-search-minus mx-3 ${zoomOutClass}`}
          onClick={zoomOut}
          style={{ background: "#E31837" }}
        />
        <span style={{ background: "#E31837" }}>
          {(scale * 100).toFixed()}%
        </span>
        <i
          className={`fa-solid  fa-search-plus mx-3 ${zoomInClass}`}
          onClick={zoomIn}
          style={{ background: "#E31837" }}
        />
      </div>

      <div className="mx-3"></div>
    </div>
  );
};

export default ControlPanel;
