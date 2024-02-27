const url = "https://ba09580e-e7a2-4d8f-ac33-1e59e5594f17.mock.pstmn.io";
const my_token = localStorage.getItem("token");
const pingNodeForm = document.getElementById("ping-node-form");
const error_close = document.querySelector(".error-close-icon");
const show_error = document.querySelector(".show-error");

error_close.addEventListener("click", function (e) {
  e.preventDefault();
  show_error.style.display = "none";
});

function showError(response) {
  /// error show ///
  const errorClose = document.querySelector(".error-close-icon");
  const errorElement = document.querySelector(".show-error");

  errorClose.addEventListener("click", function (e) {
    e.preventDefault();
    errorElement.style.display = "none";
  });

  if (response.status !== 200) {
    errorElement.style.display = "block";
    errorElement.style.backgroundColor = "#c65161";
    const errorMsg = document.getElementById("error-content");
    errorMsg.innerHTML = `<img  src="images/error-logo.svg" class="error-icon"/>
            <p id="error-message">
            Your request was failed !! (status code : ${response.status})
            </p>`;
  } else {
    errorElement.style.display = "block";
    errorElement.style.backgroundColor = "#58cc87";
    const successMsg = document.getElementById("error-content");
    successMsg.innerHTML = `<img  src="images/success Icon.svg" class="error-icon"/>
            <p id="error-message">
            Your request was done successfully !!
            </p>`;
  }
}

pingNodeForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  const pingNodeIp = [];

  pingNodeIp[0] = data.ping_node_ip_octet1;
  pingNodeIp[1] = data.ping_node_ip_octet2;
  pingNodeIp[2] = data.ping_node_ip_octet3;
  pingNodeIp[3] = data.ping_node_ip_octet4;

  const formData = {
    ping_node_type: data.ping_node_type,
    ping_node_ip: pingNodeIp.join("."),
  };

  console.log(JSON.stringify(formData));

  fetch(`${url}/api/troubleshooting/ping`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${my_token}`,
    },
    body: JSON.stringify(formData),
  })
    .then((response) => {
      console.log(response);
      showError(response);
      return response.json();
    })
    .then((data) => {
      const commandResult = $("#command-result");
      commandResult.html(data.commandResult);
    })
    .catch((error) => {
      console.log(error);
    });
});

const packetCaptureForm = document.getElementById("packet-capture-form");

packetCaptureForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = Object.fromEntries(new FormData(e.target));
  console.log(JSON.stringify(formData));

  fetch(`${url}/api/troubleshooting/packetCapture`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${my_token}`,
    },
    body: JSON.stringify(formData),
  })
    .then((response) => {
      console.log(response);
      showError(response);
    })
    .catch((error) => {
      console.log(error);
    });
});

///////////////////////////////// toolbar icons ///////////////////////////////////////////////////////////

/// log out ///
const logOutShow = document.querySelector(".log-out");
const logOutIcon = document.getElementById("log-out-icon");
const logOutConfirmButton = document.getElementById("log-out-confirm-button");
const logOutCancelButton = document.getElementById("log-out-cancel-button");

logOutIcon.addEventListener("click", function (e) {
  e.preventDefault();
  logOutShow.style.display = "block";
});

logOutConfirmButton.addEventListener("click", function (e) {
  e.preventDefault();
  localStorage.removeItem("token");
  $("head").append(
    `<meta http-equiv="refresh" content="0; URL=Login Page – Language Toggle.html" />`
  );
});

logOutCancelButton.addEventListener("click", function (e) {
  e.preventDefault();
  logOutShow.style.display = "none";
});

/// profile ///
const profileShow = document.querySelector(".profile");
const profileIcon = document.getElementById("profile-icon");
const imageCloseIcon = document.getElementById("image-close");
const imageTickIcon = document.getElementById("image-tick");
const profileContentImages = document.querySelector(".profile-content-images");
const accountInfoImg = document.querySelector(".sidebar-account-info-image");

profileIcon.addEventListener("click", function (e) {
  e.preventDefault();
  profileShow.style.display = "block";
});

profileContentImages.addEventListener("click", function (e) {
  e.preventDefault();
  for (let i = 0; i < profileContentImages.children.length; i++) {
    profileContentImages.children[i].style.backgroundColor = "#1f666e";
  }

  if (e.target.classList.contains("list-image")) {
    const id = e.target.id;
    e.target.style.backgroundColor = "white";

    imageTickIcon.addEventListener("click", function (e) {
      e.preventDefault();
      accountInfoImg.setAttribute("src", `images/${id}.svg`);
    });
  }
});

imageCloseIcon.addEventListener("click", function (e) {
  e.preventDefault();
  for (let i = 0; i < 9; i++) {
    profileContentImages.children[i].style.backgroundColor = "#1f666e";
  }
  profileContentImages.style.backgroundColor = "#1f666e";
  profileShow.style.display = "none";
});
