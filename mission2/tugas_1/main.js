// Variabel global untuk melacak produk di keranjang
const cartItems = [];

document.addEventListener("DOMContentLoaded", function () {
  // Menemukan semua elemen dengan kelas .minus-btn, .plus-btn, dan .quantity-input
  const minusButtons = document.querySelectorAll(".minus-btn");
  const plusButtons = document.querySelectorAll(".plus-btn");
  const inputFields = document.querySelectorAll(".quantity-input");
  const cartItemsContainer = document.getElementById("cart-items");

  // Menambahkan event listener untuk setiap tombol minus
  minusButtons.forEach(function (minusButton, index) {
    minusButton.addEventListener("click", function () {
      const currentValue = parseInt(inputFields[index].value);
      if (currentValue > 0) {
        inputFields[index].value = currentValue - 1;
        updateCart(index, currentValue - 1);
      }
    });
  });

  // Menambahkan event listener untuk setiap tombol plus
  plusButtons.forEach(function (plusButton, index) {
    plusButton.addEventListener("click", function () {
      const currentValue = parseInt(inputFields[index].value);
      inputFields[index].value = currentValue + 1;
      updateCart(index, currentValue + 1);
    });
  });

  // Menemukan semua tombol "Add To Cart" dan menambahkan event listener
  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  addToCartButtons.forEach(function (button, index) {
    button.addEventListener("click", function () {
      const quantity = parseInt(inputFields[index].value);
      if (quantity > 0) {
        const productName = button.getAttribute("data-product");
        const productPrice = productPrices[index]; // Anda perlu mengganti ini dengan harga produk sesuai indeks
        const productImage = button.getAttribute("data-image"); // Mengambil nama file gambar produk
        addToCart(productName, productPrice, quantity, productImage);
        // Mengatur ulang jumlah produk ke 0
        inputFields[index].value = "0";
      }
    });
  });

  // Fungsi untuk menambahkan produk ke keranjang
  function addToCart(productName, productPrice, quantity, productImage) {
    const cartItem = document.querySelector(
      `#cart-items .cart-item[data-product="${productName}"]`
    );

    // Jika item sudah ada di keranjang, perbarui jumlahnya
    if (cartItem) {
      const cartItemQuantity = cartItem.querySelector(".cart-quantity");
      const currentQuantity = parseInt(
        cartItemQuantity.textContent.split(":")[1].trim()
      );
      const newQuantity = currentQuantity + quantity;
      cartItemQuantity.textContent = `Quantity: ${newQuantity}`;
      updateCartItem(productName, newQuantity);

      // Perbarui total harga produk dalam objek cartItems
      cartItems.forEach(function (item) {
        if (item.name === productName) {
          item.totalPrice = newQuantity * item.price; // Hitung total harga disini
        }
      });
    } else {
      // Jika item belum ada, tambahkan ke keranjang
      const newCartItem = document.createElement("div");
      newCartItem.classList.add("cart-item");
      newCartItem.setAttribute("data-product", productName);
      newCartItem.innerHTML = `
        <div class="row">
          <div class="col-2">
          <img src="assets/${productImage}" alt="${productName}" class="cart-product-image" style="width: 100px; height: 80px; margin-top:10px; margin-bottom:20px;">
          </div>
          <div class="col-8">
            <p class="cart-product-name">${productName}</p>
            <p class="cart-quantity">Quantity: ${quantity}</p>
            <p class="cart-product-price">Rp. ${productPrice}</p>
            <div class="col-2">
              <button class="btn btn-danger btn-sm remove-from-cart">Remove</button>
            </div>
          </div>
        </div>
      `;
      cartItemsContainer.appendChild(newCartItem);

      // Tambahkan event listener untuk tombol "Remove" yang baru ditambahkan
      const removeButton = newCartItem.querySelector(".remove-from-cart");
      removeButton.addEventListener("click", function () {
        removeCartItem(productName);
      });

      // Tambahkan produk ke cartItems dengan total harga yang dihitung
      const totalPrice = productPrice * quantity; // Hitung total harga disini
      cartItems.push({
        name: productName,
        price: productPrice,
        quantity: quantity,
        totalPrice: totalPrice,
      });
    }

    // Hitung ulang total harga produk di keranjang
    calculateTotalPrice();
  }

  // Fungsi untuk mengupdate item di cartItems
  function updateCartItem(productName, newQuantity) {
    cartItems.forEach(function (item) {
      if (item.name === productName) {
        item.quantity = newQuantity;
        item.totalPrice = item.price * newQuantity;
      }
    });
  }

  // Fungsi untuk menghitung total harga produk di keranjang
  function calculateTotalPrice() {
    let totalPrice = 0;

    cartItems.forEach(function (item) {
      totalPrice += item.totalPrice; // Menggunakan totalPrice dari objek cartItems
    });

    // Tampilkan total harga di elemen dengan ID "total-price"
    const totalPriceElement = document.getElementById("total-price");
    totalPriceElement.textContent = `Rp. ${totalPrice.toFixed(2)}`;

    // Hitung pajak (11% dari total harga)
    const tax = totalPrice * 0.11;
    const taxElement = document.getElementById("tax");
    taxElement.textContent = `Rp. ${tax.toFixed(2)}`;

    // Hitung total yang harus dibayar
    const totalPayment = totalPrice + tax;
    const totalPaymentElement = document.getElementById("total-payment");
    totalPaymentElement.textContent = `Rp. ${totalPayment.toFixed(2)}`;
  }

  // Fungsi untuk menghasilkan konten struk belanja
  function generateReceiptContent() {
    let receiptContent = "";
    let total = 0;
    // Produk dalam keranjang
    cartItems.forEach(function(item) {
      receiptContent += `<p>${item.name} <span style="margin-left:100px; font-weight:bold;">Rp. ${item.totalPrice}</span></p>`;
      receiptContent += `<p style="margin-top:-10px;">Rp. ${item.price} x ${item.quantity}</p>`;

      total += item.totalPrice;
    });
  
    // Total harga, pajak (11%), dan total bayar
    const totalPrice = total;
    const tax = totalPrice * 0.11;
    const totalPayment = totalPrice + tax;


    receiptContent += `<p class="total-price">Total Harga: Rp. ${totalPrice}</p>`;
    receiptContent += `<p class="tax-label">Pajak (11%): Rp. ${tax}</p>`;
    receiptContent += `<p class="total-label">Total Bayar: Rp. ${totalPayment}</p>`;


  return receiptContent;
}

// Fungsi untuk mengisi modal struk belanja
function updateModal() {
  // Ambil konten struk belanja
  const receiptContent = generateReceiptContent();

  // Masukkan konten struk belanja ke dalam modal
  const modalBody = document.querySelector(".modal-body");
  modalBody.innerHTML = receiptContent;
}

// Event listener untuk tombol "Bayar" yang akan mengisi modal struk belanja
document.getElementById("pay-button").addEventListener("click", function () {
  updateModal();
});
  // ...

  // Simpan harga produk dalam array sesuai dengan urutan produk
  const productPrices = [500000, 420000, 620000, 350000]; // Ganti dengan harga produk sesuai indeks

  // Fungsi untuk menghapus item dari keranjang
  function removeCartItem(productName) {
    const cartItem = document.querySelector(
      `#cart-items .cart-item[data-product="${productName}"]`
    );
    if (cartItem) {
      cartItem.remove();

      // Hapus item dari array cartItems
      const indexToRemove = cartItems.findIndex((item) => item.name === productName);
      if (indexToRemove !== -1) {
        cartItems.splice(indexToRemove, 1);
      }

      // Hitung ulang total harga produk di keranjang
      calculateTotalPrice();
    }
  }

  // Fungsi untuk reset keranjang
  document.getElementById("reset-cart").addEventListener("click", function () {
    cartItems.length = 0;
    cartItemsContainer.innerHTML= "";
    calculateTotalPrice();
  });
});
