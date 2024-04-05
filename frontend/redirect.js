function redirect() {
  // console.log("redirecting");
  window.location.href = "/api-docs"; // Change to '/api-docs' when SwaggerUI is implemented ~AaronB
}

window.onload = setTimeout(redirect, 3000);
