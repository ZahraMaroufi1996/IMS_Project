const url = "https://6caa7857-e223-4452-a358-4d23018bc06a.mock.pstmn.io";
const token = localStorage.getItem("token");

function loadPage() {
  fetch(`${url}/api/configuration`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      getGeneralData(data);
      getPcscfData(data);
      getScscfData(data);
      getIcscfData(data);
      getRtpProxyData(data);
    })
    .catch((error) => {
      console.log(error);
    });
}

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

function getTime() {
  fetch(`${url}/api/general`)
    .then((response) => response.json())
    .then((data) => {
      const globalHour = data.timeHour;
      const globalMin = data.timeMin;
      const globalSec = data.timeSec;

      let localHour;
      let localMin;
      let localSec;

      if (data.timeZone === "Iran") {
        localHour = data.timeHour + 3;
        localMin = data.timeMin + 30;
        localSec = data.timeSec;
      }

      if (localHour < 10) {
        localHour = `0${localHour}`;
      }

      if (localMin < 10) {
        localMin = `0${localMin}`;
      }

      if (localSec < 10) {
        localSec = `0${localSec}`;
      }

      if (globalHour < 10) {
        globalHour = `0${globalHour}`;
      }

      if (globalMin < 10) {
        globalMin = `0${globalMin}`;
      }

      if (globalSec < 10) {
        globalSec = `0${globalSec}`;
      }

      const localTime = document.getElementById("local-time");
      const globalTime = document.getElementById("global-time");

      localTime.innerHTML = `${localHour}:${localMin}:${localSec}`;
      globalTime.innerHTML = `${globalHour}:${globalMin}:${globalSec}`;
    })
    .catch((error) => {
      console.log(error);
    });
}

function getGeneralData(data) {
  const imsDomain = document.querySelector(`.general-content-ims-domain-box`);
  imsDomain.setAttribute("value", `${data.domain}`);
  const enableHomerPcscf = document.getElementsByName(`enable_homer_pcscf`);
  const enableHomerScscf = document.getElementsByName(`enable_homer_scscf`);
  const enableHomerIcscf = document.getElementsByName(`enable_homer_icscf`);
  const enableHomer = [
    enableHomerPcscf[0],
    enableHomerScscf[0],
    enableHomerIcscf[0],
  ];
  for (let i = 0; i < data.homerEnable.length; i++) {
    for (let j = 0; j < enableHomer.length; j++) {
      if (enableHomer[j].value === data.homerEnable[i]) {
        enableHomer[j].checked = true;
      }
    }
  }
}

function getPcscfData(data) {
  const enableIpSec = document.getElementById("ipsec");
  if (data.pcscf.ipSec === true) {
    enableIpSec.checked = true;
  }

  const encryptionAlgorithmAes = document.getElementsByName(
    `encryption_algorithm_aes`
  );

  const encryptionAlgorithmDes = document.getElementsByName(
    `encryption_algorithm_des`
  );

  const encryptionAlgorithmPlain = document.getElementsByName(
    `encryption_algorithm_plain`
  );

  const encryptionAlgorithms = [
    encryptionAlgorithmAes[0],
    encryptionAlgorithmDes[0],
    encryptionAlgorithmPlain[0],
  ];

  for (let i = 0; i < data.pcscf.algorithms.length; i++) {
    for (let j = 0; j < encryptionAlgorithms.length; j++) {
      if (encryptionAlgorithms[j].value === data.pcscf.algorithms[i]) {
        encryptionAlgorithms[j].checked = true;
      }
    }
  }

  const enableTls = document.getElementById("tls");
  if (data.pcscf.tls === true) {
    enableTls.checked = true;
  }

  const pcscfSharedMemory = document.getElementById("pcscf-shared-memory");
  pcscfSharedMemory.setAttribute("value", `${data.pcscf.shareMemory}`);
  const pcscfPrivateMemory = document.getElementById("pcscf-private-memory");
  pcscfPrivateMemory.setAttribute("value", `${data.pcscf.privateMemory}`);
  getRxConfigurationData(data.pcscf.rxConfiguration);
}

function getRxConfigurationData(data) {
  const transportProtocol = document.getElementsByName("transport_protocol");
  for (let i = 0; i < transportProtocol.length; i++) {
    {
      if (transportProtocol[i].value === data.protocol) {
        transportProtocol[i].checked = true;
      }
    }
  }

  const pcrfIpAddress = [];
  for (let i = 0; i < 4; i++) {
    pcrfIpAddress[i] = document.getElementById(`pcrf-ip-address-octet${i + 1}`);
    pcrfIpAddress[i].setAttribute("value", `${data.ip.split(".")[i]}`);
  }

  const enableRxSourcePort = document.getElementById("enable-rx-source-port");
  if (data.sourcePortEnabled === true) {
    enableRxSourcePort.checked = true;
  }

  const rxSourcePort = document.getElementById("rx-source-port");
  rxSourcePort.setAttribute("value", `${data.sourcePort}`);

  const pcrfFqnd = document.getElementById("rx-configuration-pcrf-fqdn");
  pcrfFqnd.setAttribute("value", `${data.fqdn}`);

  const pcrfRealm = document.getElementById("rx-configuration-pcrf-realm");
  pcrfRealm.setAttribute("value", `${data.realm}`);
}

function getScscfData(data) {
  const scscfSharedMemory = document.getElementById("scscf-shared-memory");
  scscfSharedMemory.setAttribute("value", `${data.scscf.shareMemory}`);
  const scscfPrivateMemory = document.getElementById("scscf-private-memory");
  scscfPrivateMemory.setAttribute("value", `${data.scscf.privateMemory}`);

  const minimumRegisterTime = document.getElementById("minimum-register-time");
  minimumRegisterTime.setAttribute(
    "value",
    `${data.scscf.minimumRegisterTime}`
  );

  const maximumRegisterTime = document.getElementById("maximum-register-time");
  maximumRegisterTime.setAttribute(
    "value",
    `${data.scscf.maximumRegisterTime}`
  );
}

function getIcscfData(data) {
  const icscfSharedMemory = document.getElementById("icscf-shared-memory");
  icscfSharedMemory.setAttribute("value", `${data.icscf.shareMemory}`);
  const icscfPrivateMemory = document.getElementById("icscf-private-memory");
  icscfPrivateMemory.setAttribute("value", `${data.icscf.privateMemory}`);
}

function getRtpProxyData(data) {
  const supportedHdCodeG_722 = document.getElementsByName(
    `supported_hd_codes_g.722`
  );

  const supportedHdCodeAmrWB = document.getElementsByName(
    `supported_hd_codes_amr_wb`
  );

  const supportedHdCodes = [supportedHdCodeG_722[0], supportedHdCodeAmrWB[0]];

  for (let i = 0; i < data.rtpProxy.supportedHdCoders.length; i++) {
    for (let j = 0; j < supportedHdCodes.length; j++) {
      if (supportedHdCodes[j].value === data.rtpProxy.supportedHdCoders[i]) {
        supportedHdCodes[j].checked = true;
      }
    }
  }

  const enableSrtp = document.getElementById("srtp");
  if (data.rtpProxy.srtp === true) {
    enableSrtp.checked = true;
  }

  const inboundPortMinimum = document.getElementById("inbound-port-minimum");
  inboundPortMinimum.setAttribute(
    "value",
    `${data.rtpProxy.inboundPortMinimum}`
  );

  const inboundPortMaximum = document.getElementById("inbound-port-maximum");
  inboundPortMaximum.setAttribute(
    "value",
    `${data.rtpProxy.inboundPortMaximum}`
  );

  const outboundPortMinimum = document.getElementById("outbound-port-minimum");
  outboundPortMinimum.setAttribute(
    "value",
    `${data.rtpProxy.outboundPortMinimum}`
  );

  const outboundPortMaximum = document.getElementById("outbound-port-maximum");
  outboundPortMaximum.setAttribute(
    "value",
    `${data.rtpProxy.outboundPortMaximum}`
  );

  const enableCallDuration = document.getElementById("enable-call-duration");
  if (data.rtpProxy.maximumCallDurationEnable === true) {
    enableCallDuration.checked = true;
  }
  const callDuration = document.getElementById("call-duration");
  callDuration.setAttribute("value", `${data.rtpProxy.maximumCallDuration}`);
  const lossTimeout = document.getElementById("rtp-proxy-loss-timeout");
  lossTimeout.setAttribute("value", `${data.rtpProxy.rtpLossTimeout}`);
}

async function init() {
  await loadPage();
}

init();

/// edit form ///
const editButton = document.querySelector(".information-edit-button");
editButton.addEventListener("click", function (e) {
  e.preventDefault();
  const allInputs = document.getElementsByTagName("input");
  for (let i = 0; i < allInputs.length; i++) {
    allInputs[i].disabled = false;
  }
});

/// save button ///
const totalForm = document.getElementById("total-form");
totalForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = Object.fromEntries(new FormData(e.target));
  console.log(formData);
  const result = fetch(`${url}/api/configuration/submitForm`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  })
    .then((response) => {
      showError(response);
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
});

//   getTime();
//   setInterval(getTime, 60 * 1000 * 15);

///////////////////////////////////////////////////////// toolbar icons///////////////////////

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

// let exit_show = document.querySelector(".exit");
// let exit_icon = document.getElementById("exit-icon");
// let exit_button = document.querySelector(".exit-button");
// let exit_cancel_button = document.querySelector(".exit-cancel-button");

// exit_icon.addEventListener("click", function (e) {
//   e.preventDefault();
//   exit_show.style.display = "block";
// });

// exit_button.addEventListener("click", function (e) {
//   "use strict";
//   e.preventDefault();
//   var confirm_result = confirm("Are you sure you want to quit?");
//   if (confirm_result == true) {
//     window.close();
//   }
// });

// exit_cancel_button.addEventListener("click", function (e) {
//   e.preventDefault();
//   exit_show.style.display = "none";
// });

// let sound_show = document.querySelector(".sound");
// let sound_icon = document.getElementById("sound-icon");
// let sound_text = document.querySelector(".sound-text");
// let sound_img = sound_icon.children[0];

// let sound_enable = true;

// sound_icon.addEventListener("click", function (e) {
//   e.preventDefault();
//   sound_show.style.display = "block";

//   sound_enable = !sound_enable;

//   if (sound_enable === true) {
//     sound_text.innerHTML = "System has unmuted!";
//     sound_img.setAttribute(
//       "src",
//       `images/IMS_TOPOLOGY_images/Title Bar Icon _ Sound.svg`
//     );
//   } else {
//     sound_text.innerHTML = "System has muted!";
//     sound_img.setAttribute("src", `images/Title Bar Icon _ Sound OFF.svg`);
//   }

//   setTimeout(() => {
//     sound_show.style.display = "none";
//   }, 2000);
// });
