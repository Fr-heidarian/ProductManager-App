import { productTable, currentPage } from "./app.js";
import {
  createPagination,
  currentPageSize,
  generateQueryParams,
} from "./utility.js";

const BASE_URL = "https://6300a18859a8760a757d441c.mockapi.io";

export const controller = new AbortController();
const signal = controller.signal;

const editModal = document.querySelector("#editModal");
const viewModal = document.querySelector("#viewModal");

// CREATE
export const createNewProduct = async (e) => {
  e.preventDefault();

  const newProduct = {
    name: e.target["name"].value,
    price: e.target["price"].value,
    countInStock: e.target["countInStock"].value,
  };

  try {
    await fetch(`${BASE_URL}/products`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(newProduct),
    });
  } catch (e) {
    console.log(e.message);
  }

  // fetch(`${BASE_URL}/products`, {
  //   method: "post",
  //   headers: { "content-type": "application/json", Accept: "application/json" },
  //   body: JSON.stringify(newProduct),
  // }).then((res) => readProducts());

  // Upload Image
  const formData = new FormData();
  formData.append("image", e.target["file-input"].files[0]);
  await fetch(`${BASE_URL}/products/upload`, {
    method: "POST",
    body: formData,
  });
};

// READ
export const readProducts = async (searchTerm) => {
  const loadingSpinner = document.querySelector(".spinner-container");
  loadingSpinner.classList.toggle("d-none");

  try {
    const res = await fetch(
      `${BASE_URL}/products${generateQueryParams(
        currentPage,
        currentPageSize,
        searchTerm
      )}`,
      { signal }
    );

    if (res.ok) {
      const data = await res.json();
      const { products, count } = data;
      createPagination(count);
      productTable.innerHTML = "";
      products.forEach(addToDOM);
    } else {
      throw new Error("can not fetch");
    }
  } catch (e) {
    console.log(e.message);
  } finally {
    loadingSpinner.classList.toggle("d-none");
  }

  // fetch(
  //   `${BASE_URL}/products${generateQueryParams(
  //     currentPage,
  //     currentPageSize,
  //     searchTerm
  //   )}`,
  //   {
  //     signal,
  //   }
  // )
  //   .then((res) => {
  //     return res.json();
  //   })
  //   .then((data) => {
  //     const { products, count } = data;
  //     createPagination(count);
  //     productTable.innerHTML = "";
  //     products.forEach(addToDOM);
  //   })
  //   .catch((err) => console.log("error"))
  //   .finally(() => {
  //     loadingSpinner.classList.toggle("d-none");
  //   });
};

// UPDATE
export const updateProduct = async (e) => {
  e.preventDefault();
  const id = e.target["confirm-edit-btn"].dataset.id;

  const updatedProduct = {
    name: e.target["name"].value,
    price: e.target["price"].value,
    countInStock: e.target["countInStock"].value,
    description: e.target["description"].value,
    department: e.target["department"].value,
    material: e.target["material"].value,
  };

  try {
    await fetch(`${BASE_URL}/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProduct),
    });
    await readProducts();
  } catch (e) {
    console.log(e.message);
  }

  // fetch(`${BASE_URL}/products/${id}`, {
  //   method: "PUT",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(updatedProduct),
  // })
  //   .then((res) => readProducts())
  //   .catch((err) => console.log("error"));
};

// DELETE
export const deleteProduct = async (productId) => {
  await fetch(`${BASE_URL}/products/${productId}`, { method: "delete" }).then(
    () => {
      readProducts();
    }
  );

  // fetch(`${BASE_URL}/products/${productId}`, { method: "delete" }).then(() => {
  //   readProducts();
  // });
};

// View Modal
const viewProduct = (productId) => {
  fetch(`${BASE_URL}/products/${productId}`)
    .then((res) => res.json())
    .then((product) => {
      viewProductDetails(product);
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const addToDOM = (product) => {
  const productRow = document.createElement("tr");
  const { nameCell, priceCell, countCell, createDateCell, actionsCell } =
    generateTableCell(product);

  productRow.appendChild(nameCell);
  productRow.appendChild(priceCell);
  productRow.appendChild(countCell);
  productRow.appendChild(createDateCell);
  productRow.appendChild(actionsCell);

  productTable.appendChild(productRow);
};

const generateTableCell = (product) => {
  const nameCell = document.createElement("td");
  nameCell.innerHTML = product.name;
  nameCell.title = product.name;

  const priceCell = document.createElement("td");
  priceCell.innerHTML = product.price;
  priceCell.title = product.price;

  const countCell = document.createElement("td");
  countCell.innerHTML = product.countInStock;
  countCell.title = product.countInStock;

  const createDateCell = document.createElement("td");
  const date = new Date(product.createdAt).toDateString();
  createDateCell.innerHTML = date;
  createDateCell.title = date;

  const viewButton = document.createElement("button");
  viewButton.innerHTML = '<i class="bi bi-eye"></i>';
  viewButton.className = "btn btn-warning btn-sm m-1 text-white";
  viewButton.dataset.bsToggle = "modal";
  viewButton.dataset.bsTarget = "#viewModal";
  viewButton.addEventListener("click", () => viewProduct(product.id));

  const editButton = document.createElement("button");
  editButton.innerHTML = '<i class="bi bi-pen"></i>';
  editButton.className = "btn btn-primary btn-sm m-1 text-white";
  editButton.dataset.bsToggle = "modal";
  editButton.dataset.bsTarget = "#editModal";
  editButton.addEventListener("click", () => {
    editProduct(product);
  });

  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = '<i class="bi bi-trash"></i>';
  deleteButton.className = "btn btn-danger btn-sm m-1 text-white";
  deleteButton.dataset.bsToggle = "modal";
  deleteButton.dataset.bsTarget = "#deleteModal";
  deleteButton.addEventListener("click", () => {
    removeProduct(product.id);
  });

  const actionsCell = document.createElement("td");
  actionsCell.appendChild(viewButton);
  actionsCell.appendChild(editButton);
  actionsCell.appendChild(deleteButton);

  return { nameCell, priceCell, countCell, createDateCell, actionsCell };
};

const editProduct = (product) => {
  editModal.querySelector("#name").value = product.name;
  editModal.querySelector("#price").value = product.price;
  editModal.querySelector("#countInStock").value = product.countInStock;
  editModal.querySelector("#description").value = product.description;
  editModal.querySelector("#department").value = product.department;
  editModal.querySelector("#material").value = product.material;
  editModal.querySelector("#confirm-edit-btn").dataset.id = product.id;
};

const removeProduct = (id) => {
  document.querySelector("#confirm-delete-btn").dataset.id = id;
};

const viewProductDetails = (product) => {
  const date = new Date(product.createdAt).toDateString();

  viewModal.querySelector("#name").innerHTML = product.name;
  viewModal.querySelector("#price").textContent = product.price;
  viewModal.querySelector("#count").textContent = product.countInStock;
  viewModal.querySelector("#date").textContent = date;
  viewModal.querySelector("#description").textContent = product.description;
  viewModal.querySelector("#department").textContent = product.department;
  viewModal.querySelector("#material").textContent = product.material;
};
