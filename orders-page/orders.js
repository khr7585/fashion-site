const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://fashion-site-0onq.onrender.com";

async function loadOrders() {
  const container = document.getElementById("ordersList");

  try {
    const res = await fetch(`${API_URL}/api/orders`, { credentials: "include" });

    if (res.status === 401) {
      container.innerHTML = `<p>Please <a href="../login-page/index.html">log in</a> to view your orders.</p>`;
      return;
    }

    const data = await res.json();

    if (!data.success || data.orders.length === 0) {
      container.innerHTML = `<p>You haven't placed any orders yet.</p>`;
      return;
    }

    container.innerHTML = "";

    data.orders.forEach((order) => {
      const date = new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      const itemsHtml = order.items
        .map(
          (item) => `
        <div class="order-item">
          <img src="${item.image}" width="50">
          <div>
            <p class="item-name">${item.name} x${item.quantity}</p>
            <p class="item-price">₹${item.price.toFixed(2)}</p>
          </div>
        </div>
      `,
        )
        .join("");

      container.innerHTML += `
        <div class="order-card">
          <div class="order-header">
            <span>Order placed ${date}</span>
            <span class="order-status">${order.status}</span>
          </div>
          <div class="order-items">${itemsHtml}</div>
          <div class="order-footer">
            <span>Shipped to: ${order.address.fullName}, ${order.address.city}</span>
            <span class="order-total">Total: ₹${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      `;
    });
  } catch (err) {
    console.error("Failed to load orders:", err.message);
    container.innerHTML = `<p>Something went wrong loading your orders.</p>`;
  }
}

loadOrders();