import React, { useState, useEffect } from "react";

import { doubleArrow } from "../assets";

const Pagination = ({
  total = 0,
  currentPage,
  objectPerPage = 10,
  maxPageList = 6,
  setCurrentPage,
  WhiteTheme
} = {}) => {
  const [pageStart, setPageStart] = useState(0);
  const [pageEnd, setPageEnd] = useState(6);
  const [pageList, setPageList] = useState([]);

  const pageCount = Math.ceil(total / objectPerPage);

  function setPageState(next = 1) {
    if (next < 0 && pageStart > 0) {
      setPageStart(pageStart - 1);
      setPageEnd(pageEnd - 1);
    } else if (next > 0 && pageEnd < pageCount) {
      setPageEnd(pageEnd + 1);
      setPageStart(pageStart + 1);
    }
    loadPageList();
  }

  function loadPageList() {
    let list = [];

    for (let i = pageStart; i < pageEnd; i++) {
      list.push(
        <div
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`${currentPage == i && "current-page brightness-200" } 
          ${WhiteTheme ? "hover:text-black" : "hover:text-white"} cursor-pointer `}
        >
          {i + 1}
        </div>
      );
    }

    setPageList(list);
  }

  useEffect(() => {
    let end =
      currentPage + maxPageList > pageCount
        ? pageCount
        : currentPage + maxPageList;
    let start =
      currentPage + maxPageList > pageCount
        ? pageCount - maxPageList
        : currentPage;

    if (start < 0) start = 0;
    if (end > pageCount) end = pageCount;
    setPageEnd(end);
    setPageStart(start);
  });

  useEffect(() => {
    loadPageList();
  }, [pageStart, pageEnd, currentPage, WhiteTheme]);

  return (
    <>
      {pageCount > 1 && (
        <div className={`flex gap-6 justify-center ${WhiteTheme ? "bg-[#ffffff] text-[#b2b3bd] shadow-xl" : "bg-[#1c1c24] text-[#9ca3af]" } rounded-[10px] px-[16px] py-[8px]  pagination-block`}>
          {pageCount > maxPageList && (
            <img
              src={doubleArrow}
              onClick={() => setPageState(-1)}
              alt="Previous Page"
              className="w-[16px] rotate-180 grayscale hover:grayscale-0"
            />
          )}
          {pageList}
          {pageCount > maxPageList && (
            <img
              src={doubleArrow}
              onClick={() => setPageState(1)}
              alt="Next Page"
              className=" w-[16px] grayscale hover:grayscale-0"
            />
          )}
        </div>
      )}
    </>
  );
};

export default Pagination;
