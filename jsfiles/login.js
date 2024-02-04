const url = "https://cdfb4ab4-65e8-498e-890c-570e0ade6a15.mock.pstmn.io";
let my_token;
let my_form = document.getElementById("login-form");
my_form.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = Object.fromEntries(new FormData(e.target));

  fetch(`${url}/api/login?Content-Type=application/json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      my_token = data.token;
      console.log(my_token);
      localStorage.setItem("token", my_token);
      $("head").append(
        `<meta http-equiv="refresh" content="0; URL=After_Login_Page.html" />`
      );
    })
    .catch((error) => {
      console.log(error);
    });
});
