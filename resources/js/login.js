const url = "https://6caa7857-e223-4452-a358-4d23018bc06a.mock.pstmn.io";
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
        `<meta http-equiv="refresh" content="0; URL=after-login.html" />`
      );
    })
    .catch((error) => {
      console.log(error);
    });
});

/// language switch ///
const languageElement = document.getElementById("language");
languageElement.addEventListener("click", function (e) {
  console.log(languageElement.checked);
  let formContent;
  if (languageElement.checked === false) {
    formContent = `
      <div class="username-container d-flex flex-row justify-content-around">
        <input
          class="username-input-persian"
          type="text"
          name="username"
          placeholder="نام کاربری"
        />
        <img src="resources/images/Group 8492.svg" class="username-icon" />
      </div>
      <div class="password-container d-flex flex-row justify-content-around">
        <input
          class="password-input-persian"
          type="password"
          name="password"
          placeholder="رمز عبور"
        />
        <img src="resources/images/Group 8493.svg" class="password-icon" />
      </div>
      <button type="submit" class="submit-button">وارد شوید</button>`;
  } else {
    formContent = `
      <div class="username-container d-flex flex-row justify-content-around">
        <img src="resources/images/User_inverse.svg" class="username-icon" />
        <input
          class="username-input-english"
          type="text"
          name="username"
          placeholder="username"
        />
      </div>
      <div class="password-container d-flex flex-row justify-content-around">
        <img src="resources/images/Pass_inverse.svg" class="password-icon" />
        <input
          class="password-input-english"
          type="password"
          name="password"
          placeholder="password"
        />
      </div>
      <button type="submit" class="submit-button">Login</button>`;
  }
  const nodeList = $("#login-form");
  nodeList.html(formContent);
});
