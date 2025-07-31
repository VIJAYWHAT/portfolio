const form = document.getElementById("contact-form");

// Notification function
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  // Add styles
  Object.assign(notification.style, {
    position: "fixed",
    top: "100px",
    right: "20px",
    padding: "12px 16px",
    borderRadius: "8px",
    color: "white",
    fontWeight: "500",
    zIndex: "1000",
    maxWidth: "300px",
    transform: "translateX(100%)",
    transition: "transform 0.3s ease-in-out",
    backgroundColor:
      type === "success"
        ? "var(--success-color)"
        : type === "error"
        ? "var(--error-color)"
        : "var(--primary-color)",
  });

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 100);

  // Remove after 5 seconds
  setTimeout(() => {
    notification.style.transform = "translateX(100%)";
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 5000);
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(form);
  const data = new URLSearchParams(formData);

  fetch(
    "https://script.google.com/macros/s/AKfycby2s9mZ_pD0sdIBy94HG0IQ6uRyeGak9-gIRwyQnLMwDXy9NBMa3y-_uv9K0XGe01UJ/exec",
    {
      method: "POST",
      body: data,
    }
  )
    .then((res) => res.text())
    .then((response) => {
      form.reset();
    })
    .catch((error) => {
      console.error("Error!", error.message);
    });
});
