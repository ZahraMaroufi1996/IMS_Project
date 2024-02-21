const url = "https://ba09580e-e7a2-4d8f-ac33-1e59e5594f17.mock.pstmn.io";
const myForm = document.getElementById("login-form");
myForm.addEventListener("submit", function (e) {
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
      const token = data.token;
      console.log(token);
      localStorage.setItem("token", token);
      $("head").append(
        `<meta http-equiv="refresh" content="0; URL=After_Login_Page.html" />`
      );
    })
    .catch((error) => {
      console.log(error);
    });
});
