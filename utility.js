import { currentPage } from "./app.js";

// export const DEFAULT_PAGE_SIZEe = 5;
export let currentPageSize = 5;

// SELECTBOX
export const updatePageSize = (selectedPageSize) => {
  currentPageSize = selectedPageSize;
};

export const createPagination = (productCount) => {
  const pageCount = Math.ceil(productCount / currentPageSize);

  let lis = `<li class="page-item ${
    Number(currentPage) === 1 ? "disabled no-events" : ""
  }" id="previous"><a class="page-link" href="#">&laquo;</a></li>`;

  for (let i = 1; i <= pageCount; i++) {
    lis += `<li class="page-item ${
      i === Number(currentPage) ? "active" : ""
    }" id="page-${i}"><a href="#" class="page-link">${i}</a></li>`;
  }

  lis += `<li class="page-item ${
    Number(currentPage) === pageCount ? "disabled no-events" : ""
  }" id="next" data-page-count="${pageCount}"><a class="page-link" href="#">&raquo;</a></li>`;

  document.querySelector("ul.pagination").innerHTML = lis;
};
// QueryParams
export const generateQueryParams = (
  page = 1,
  limit = currentPageSize,
  name = ""
) => {
  let queryParams = `?page=${page}&limit=${limit}`;
  if (name != "") {
    queryParams += `&name=${name}`;
  }
  return queryParams;
};
