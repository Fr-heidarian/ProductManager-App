import {
  readProducts,
  controller,
  createNewProduct,
  updateProduct,
  deleteProduct,
} from "./api.js";

import { updatePageSize } from "./utility.js";
export let currentPage = 1;

export const productTable = document.querySelector("#productTable tbody");
const productForm = document.querySelector("#create-product");
const editProductForm = document.querySelector("#edit-product");

readProducts();

document.querySelector("#btn-cancelRequest").addEventListener("click", () => {
  controller.abort();
});

// Pagination
document.querySelector("ul.pagination").addEventListener("click", (e) => {
  e.preventDefault();

  if (e.target.className.includes("pagination")) {
    return;
  }

  if (e.target.parentElement.id === "previous") {
    const page = currentPage - 1;
    currentPage = page === 0 ? 1 : page;
  } else if (e.target.parentElement.id === "next") {
    const page = currentPage + 1;
    currentPage =
      page > e.target.parentElement.dataset.pageCount
        ? e.target.parentElement.dataset.pageCount
        : page;
  } else {
    currentPage = Number(e.target.innerText);
  }
  readProducts();
});

// create--update--delete
productForm.addEventListener("submit", createNewProduct);
editProductForm.addEventListener("submit", updateProduct);

document.querySelector("#confirm-delete-btn").addEventListener("click", (e) => {
  const id = e.target.dataset.id;
  deleteProduct(id);
});

// SELECTBOX
const pageSizeSelect = document.querySelector("#pageSizeSelect");

pageSizeSelect.addEventListener("change", (e) => {
  const selectedPageSize = Number(e.target.value);
  updatePageSize(selectedPageSize);

  readProducts();
});

// File Upload
const preventDragDefault = (e) => {
  e.preventDefault();
  e.stopPropagation();
};

document
  .querySelector(".image-selector")
  .addEventListener("dragenter", (e) => preventDragDefault(e));
document
  .querySelector(".image-selector")
  .addEventListener("dragover", (e) => preventDragDefault(e));

document.querySelector(".image-selector").addEventListener("drop", (e) => {
  preventDragDefault(e);
  if (e.dataTransfer.files) {
    document.querySelector("#product-display").src = URL.createObjectURL(
      e.dataTransfer.files[0]
    );
  }
  document.getElementById("file-input").files = e.dataTransfer.files;
});

// Search
const searchBox = document.querySelector("#searchBox");
const debounceReadProducts = _.debounce(readProducts, 2000);
searchBox.addEventListener("input", () => {
  const searchTerm = searchBox.value.trim().toLowerCase();
  debounceReadProducts(searchTerm);
});
