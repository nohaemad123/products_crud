var product_name = document.getElementById("product_name");
var product_code = document.getElementById("product_code");
var product_price = document.getElementById("product_price");
var product_old_price = document.getElementById("product_old_price");
var product_discount = document.getElementById("product_discount");
var product_note = document.getElementById("product_note");
var product_category = document.getElementById("product_category");
var product_description = document.getElementById("product_description");
var product_rate = document.getElementById("product_rate");
var product_image = document.getElementById("product_image");
var products_div = document.querySelector(".products_div");
var add_button = document.querySelector("#addBtn");
var update_button = document.querySelector("#updateBtn");
var productList = [];
var productsLocal;
var currentIndex;

add_button.disabled = true;

var regex = {
  product_code: {
    value: /^[a-z0-9]{5,10}$/,
    isValid: false,
  },
  product_name: {
    value: /^[A-Za-z0-9 _\-']{3,10}$/,
    isValid: false,
  },
  product_price: {
    value: /^[1-9]\d*$/,
    isValid: false,
  },
  product_old_price: {
    value: /^[1-9]\d*$/,
    isValid: false,
  },
  product_discount: { value: /^100$|^[1-9][0-9]?$/, isValid: false },
  product_note: { value: /^[A-Za-z ]{3,10}$/, isValid: false },
  product_rate: { value: /^[1-5]$/, isValid: false },
  product_category: { value: /^(Tv|Mobiles|food|other)$/, isValid: false },
  product_description: { value: /^[A-Za-z0-9 ]{10,500}$/, isValid: false },
};
if (localStorage.getItem("products") != null) {
  productsLocal = JSON.parse(localStorage.getItem("products"));
  displayProducts(productsLocal);
} else {
  document.querySelector(".no_products").classList.remove("d-none");
}

product_image.addEventListener("change", function () {
  const previewImg = document.querySelector(".product_image img");
  if (this.files[0]) {
    previewImg.src = URL.createObjectURL(this.files[0]);
    document.querySelector(".product_image").classList.remove("d-none");
  }
});

function addProduct() {
  removeValidInput();
  productList = JSON.parse(localStorage.getItem("products")) || [];

  var products = {
    productName: product_name.value,
    productCode: product_code.value,
    productPrice: product_price.value,
    productOldPrice: product_old_price.value,
    productDiscount: product_discount.value,
    productNote: product_note.value,
    productCategory: product_category.value,
    productDescription: product_description.value,
    productImage: product_image.files[0]
      ? `images/${product_image.files[0].name}`
      : "images/images.png",
    productRate: parseFloat(product_rate.value),
    id: productList.length,
  };

  productList.push(products);

  updateLocalStorage(productList);
  updateFormInputValues();
  displayProducts(productList);
  if (product_image.files[0]) {
    const previewImg = document.querySelector(".product_image img");
    previewImg.src = `images/${product_image.files[0].name}`;
    document.querySelector(".product_image").classList.remove("d-none");
  }
}

function displayProducts(list) {
  var cartona = ``;
  productsLocal = JSON.parse(localStorage.getItem("products"));

  console.log(productsLocal);

  if (list) {
    for (var i = 0; i < list.length; i++) {
      console.log(productsLocal[i].productName);
      cartona += `
          <div class="col-md-4 mb-4">
            <div class="card">
              <div class="card_img position-relative">
                <div class="position-absolute badges">
                  <div class="d-flex gap-1 flex-column">
                    ${
                      list[i].productNote
                        ? `<span class="custom-badge badge bg-danger">${list[i].productNote}</span>`
                        : ""
                    }
                    ${
                      list[i].productDiscount
                        ? `<span class="custom-badge badge bg-success">${list[i].productDiscount} %</span>`
                        : ""
                    }
                  </div>
                </div>
                <img
src="${list[i].productImage || "images/images.png"}"
                  class="card-img-top"
                  height="400"
                  alt="..."
                />
                <div class="card-product-action d-flex gap-1 justify-content-center">
                  <button
                    type="button"
                    class="btn btn-action me-2"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    onclick="getProduct(${list[i].id})"
                  >
                    <i class="fa-solid fa-eye"></i>
                  </button>
                  <button
                    class="btn btn-action me-2"
                 
                    onclick="getDataToUpdate(${i})"
                  >
                    <i class="fa-solid fa-pencil"></i>
                  </button>
                  <button
                    type="button"
                    class="btn btn-action me-2"
                    onclick="deleteProduct(${list[i].id})"
                  >
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
              <div class="card-body">
                <div class="text-small mb-1">
                  <a class="text-decoration-none text-muted" href="#">
                    <small>${list[i].productCategory}</small>
                  </a>
                </div>
                <h2 class="fs-6 card_title">
                  <a class="text-inherit text-decoration-none" href="#">
                    ${list[i].newName ? list[i].newName : list[i].productName}
                  </a>
                </h2>
                ${
                  list[i].productRate
                    ? `
                  <div class="mb-1">
                    ${generateStars(list[i].productRate)}
                    <span class="text-muted small">(${
                      list[i].productRate
                    })</span>
                  </div>`
                    : ""
                }
                <span class="text-dark">$${list[i].productPrice}</span>
                <span class="text-decoration-line-through text-danger">
                  $${list[i].productOldPrice}
                </span>
              </div>
            </div>
          </div>
        `;
    }
  }

  products_div.innerHTML = cartona;
}

function getProduct(index) {
  for (var i = 0; i < productsLocal.length; i++) {
    if (productsLocal[i].id === index) {
      const product = productsLocal[index];
      document.getElementById("modal-title").innerText = product.productName;
      document.getElementById("modal-product-name").innerText =
        product.productName;
      document.getElementById(
        "modal-price"
      ).innerText = `$${product.productPrice}`;
      document.getElementById(
        "modal-old-price"
      ).innerText = `$${product.productOldPrice}`;
      document.getElementById("modal-discount").innerText =
        product.productDiscount ? `${product.productDiscount} % Off` : "";
      document.getElementById("modal-description").innerText =
        product.productDescription;
      document.getElementById("modal-code").innerText = product.productCode;
      document.getElementById("modal-category").innerText =
        product.productCategory;
      document.getElementById("modal-note").innerText = product.productNote;
      document.getElementById("modal-image").src =
        product.productImage || "images/images.png";

      document.getElementById("modal-rating").innerHTML = `
  ${generateStars(product.productRate)} <span class="text-muted">(${
        product.productRate
      })</span>
`;
    }
  }
}

function updateFormInputValues(config) {
  product_name.value = config ? config.productName : null;
  product_code.value = config ? config.productCode : null;
  product_price.value = config ? config.productPrice : null;
  product_old_price.value = config ? config.productOldPrice : null;
  product_discount.value = config ? config.productDiscount : null;
  product_note.value = config ? config.productNote : null;
  product_category.value = config ? config.productCategory : null;
  product_description.value = config ? config.productDescription : null;
  product_rate.value = config ? config.productRate : null;
  product_image.value = "";
  const imageWrapper = document.querySelector(".product_image");
  const imageElement = imageWrapper.querySelector("img");
  if (config && config.productImage) {
    imageWrapper.classList.remove("d-none");
    imageElement.src = config.productImage;
  } else {
    imageWrapper.classList.add("d-none");
    imageElement.src = "";
  }
}

function generateStars(rating) {
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars += '<i class="fa fa-star text-warning"></i>';
    } else {
      stars += '<i class="fa fa-star text-muted"></i>';
    }
  }
  return stars;
}

function deleteProduct(product_id) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      for (var i = 0; i < productsLocal.length; i++) {
        if (productsLocal[i].id === product_id) {
          productList = JSON.parse(localStorage.getItem("products")) || [];

          productList.splice(product_id, 1);

          updateLocalStorage(productList);
          displayProducts(productList);
          Swal.fire("Deleted!", "Your product has been deleted.", "success");
        }
      }
    }
  });
}

function getDataToUpdate(product_id) {
  currentIndex = product_id;
  updateFormInputValues(productsLocal[product_id]);
  add_button.classList.add("d-none");
  update_button.classList.remove("d-none");
  const imageWrapper = document.querySelector(".product_image");
  const imageElement = imageWrapper.querySelector("img");

  if (productsLocal[product_id].productImage) {
    imageElement.src = productsLocal[product_id].productImage;
    imageWrapper.classList.remove("d-none");
  } else {
    imageWrapper.classList.add("d-none");
    imageElement.src = "";
  }
}

function updateProduct() {
  removeValidInput();

  const selectedFile = product_image.files[0];

  productsLocal[currentIndex].productName = product_name.value;
  productsLocal[currentIndex].productCode = product_code.value;
  productsLocal[currentIndex].productPrice = product_price.value;
  productsLocal[currentIndex].productOldPrice = product_old_price.value;
  productsLocal[currentIndex].productDiscount = product_discount.value;
  productsLocal[currentIndex].productNote = product_note.value;
  productsLocal[currentIndex].productCategory = product_category.value;
  productsLocal[currentIndex].productDescription = product_description.value;
  productsLocal[currentIndex].productRate = product_rate.value;
  if (selectedFile) {
    productsLocal[currentIndex].productImage = `images/${selectedFile.name}`;
  } else if (!productsLocal[currentIndex].productImage) {
    productsLocal[currentIndex].productImage = "images/images.png";
  }
  add_button.classList.remove("d-none");
  update_button.classList.add("d-none");
  updateFormInputValues();
  updateLocalStorage(productsLocal);
  displayProducts(productsLocal);
}

function updateLocalStorage(products_obj) {
  localStorage.setItem("products", JSON.stringify(products_obj));
}

function search(searchValue) {
  var searchItem = [];
  document.querySelector(".no_products_search").classList.add("d-none"); // hide it first

  for (var i = 0; i < productsLocal.length; i++) {
    var item = productsLocal[i];

    if (item.productName.toLowerCase().includes(searchValue.toLowerCase())) {
      searchItem.push(item);
      item.newName = item.productName
        .toLowerCase()
        .replace(searchValue, `<span class='bg-warning'>${searchValue}</span>`);
      console.log(item);
    }
  }

  if (searchItem.length === 0) {
    document.querySelector(".no_products_search").classList.remove("d-none");
  }
  displayProducts(searchItem);
}

function validateProductInput(element) {
  if (regex[element.id].value.test(element.value)) {
    console.log("match");
    element.classList.add("is-valid");
    element.classList.remove("is-invalid");
    element.nextElementSibling?.classList.add("d-none");
    regex[element.id].isValid = true;
  } else {
    console.log("no match");
    element.classList.add("is-invalid");
    element.classList.remove("is-valid");
    element.nextElementSibling?.classList.remove("d-none");
    regex[element.id].isValid = false;
  }

  toggleAddButton();
}

function toggleAddButton() {
  if (
    regex.product_code.isValid &&
    regex.product_name.isValid &&
    regex.product_price.isValid &&
    regex.product_old_price.isValid &&
    regex.product_discount.isValid &&
    regex.product_note.isValid &&
    regex.product_rate.isValid &&
    regex.product_category.isValid &&
    regex.product_description.isValid
  ) {
    add_button.disabled = false;
  } else {
    add_button.disabled = true;
  }
}

function removeValidInput() {
  product_code.classList.remove("is-valid");
  product_name.classList.remove("is-valid");
  product_price.classList.remove("is-valid");
  product_old_price.classList.remove("is-valid");
  product_discount.classList.remove("is-valid");
  product_note.classList.remove("is-valid");
  product_category.classList.remove("is-valid");
  product_description.classList.remove("is-valid");
  product_rate.classList.remove("is-valid");
}
