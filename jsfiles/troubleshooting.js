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
  if (response.status !== 200) {
    // hasMessage = true;
    show_error.style.display = "block";
    show_error.style.backgroundColor = "#c65161";
    const error_msg = document.getElementById("error-content");
    error_msg.innerHTML = `<img  src="images/error-logo.svg" class="error-icon"/>
            <p id="error-message">
            Your request was failed !! (status code : ${response.status})
            </p>`;
  } else {
    // hasMessage = false;
    show_error.style.display = "block";
    show_error.style.backgroundColor = "#58cc87";
    const success_msg = document.getElementById("error-content");
    success_msg.innerHTML = `<img  src="images/success Icon.svg" class="error-icon"/>
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
