let nodeType = [];
let nodeInfo;
const url = "https://ba09580e-e7a2-4d8f-ac33-1e59e5594f17.mock.pstmn.io";
const token = localStorage.getItem("token");

function load_page() {
  fetch(`${url}/api/topology`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      showInitialValue(data);
    })
    .catch((error) => {
      console.log("error");
    });
}

function showError(response) {
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

function editNode(response, event, editData) {
  if (response.status == 200) {
    const desiredRow = nodeType[nodeTypeName.indexOf(curNodeType)].findIndex(
      (item) => item.id == editData.editableRowNumber
    );

    nodeType[nodeTypeName.indexOf(curNodeType)][desiredRow].name =
      editData.editContentName;
    nodeType[nodeTypeName.indexOf(curNodeType)][desiredRow].ip =
      editData.editContentIp;
    nodeType[nodeTypeName.indexOf(curNodeType)][desiredRow].status =
      editData.editContentStatus;
    event.target.parentElement.parentElement.children[0].disabled = true;
    event.target.parentElement.parentElement.children[1].disabled = true;
    event.target.parentElement.parentElement.children[2].disabled = true;
    render(nodeTypeName.indexOf(curNodeType));
  } else {
    render(nodeTypeName.indexOf(curNodeType));
  }
}

function deleteNode(response) {
  if (response.status == 200) {
    const index = nodeTypeName.findIndex(
      (num) => num === itemWillDeleteData.type
    );
    nodeType[index] = nodeType[index].filter(
      (item) =>
        !(
          item.type === itemWillDeleteData.type &&
          item.name === itemWillDeleteData.name &&
          item.ip === itemWillDeleteData.ip
        ) === true
    );
    render(index);
  }
}

function render(typeIndex) {
  const tableRows = nodeType[typeIndex].map((item) => {
    return `<td class="d-block">
                  <div class="node-table-content">
                    <form
                     id="${item.id}edit-form"
                      class="d-flex  justify-content-between align-items-center"
                    >
                      <input
                        type="text"
                        id="${item.id}pname"
                        class="node-table-content-name"
                         value = "${item.name}"
                        disabled
                      />
                      <input
                        type="text"
                        id="${item.id}pip"
                        class="node-table-content-ip"
                        value= "${item.ip}"
                        disabled
                      />
                      <input
                        type="text"
                        id="${item.id}pstatus"
                        class="node-table-content-status"
                        value= "${item.status}"
                        disabled
                      />
                      <div class="d-flex ">
                        <img
                          class="close"
                          id="${item.id}pc"
                          src="images/IMS_TOPOLOGY_images/close.svg"
                        />
                        <img
                          class="tick p-1"
                          id="${item.id}pt"
                          src="images/IMS_TOPOLOGY_images/tick.svg"
                        />
                        <img
                          class="pencil p-1"
                          id="${item.id}p"
                          src="images/IMS_TOPOLOGY_images/pencil.svg"
                        />
                        <img
                          class="trash p-1"
                          id="${item.id}"
                          src="images/IMS_TOPOLOGY_images/trash-simple.svg"
                        />
                      </div>
                    </form>
                  </div>
                </td>`;
  });

  const nodeList = $("#node-table-contents");
  nodeList.html(tableRows.join(""));
  curNodeType = nodeTypeName[typeIndex];
}

function getTime() {
  fetch(`${url}/api/general`)
    .then((response) => response.json())
    .then((data) => {
      // time_Info = data;
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

function showInitialValue(data) {
  nodeInfo = data.nodes;
  nodeType[0] = nodeInfo.filter((item) => item.type === "pcscf");
  nodeType[1] = nodeInfo.filter((item) => item.type === "rtpProxy");
  nodeType[2] = nodeInfo.filter((item) => item.type === "core");

  const subnetmask = [];
  const gateway = [];
  const databaseVirtualIp = [];
  const dnsServerVirtualIp = [];
  const homerVirtualIp = [];

  for (let i = 0; i < 4; i++) {
    subnetmask[i] = document.getElementById(`subnetmask-octet${i + 1}`);
    subnetmask[i].setAttribute("value", `${data.subnetMask.split(".")[i]}`);

    gateway[i] = document.getElementById(`gateway-octet${i + 1}`);
    gateway[i].setAttribute("value", `${data.gateway.split(".")[i]}`);

    databaseVirtualIp[i] = document.getElementById(
      `virtual-ips-database-octet${i + 1}`
    );
    databaseVirtualIp[i].setAttribute(
      "value",
      `${data.databaseVirtualIp.split(".")[i]}`
    );

    dnsServerVirtualIp[i] = document.getElementById(
      `virtual-ips-dns-server-octet${i + 1}`
    );
    dnsServerVirtualIp[i].setAttribute(
      "value",
      `${data.dnsVirtualIp.split(".")[i]}`
    );

    homerVirtualIp[i] = document.getElementById(
      `virtual-ips-homer-octet${i + 1}`
    );
    homerVirtualIp[i].setAttribute(
      "value",
      `${data.homerVirtualIp.split(".")[i]}`
    );
  }
  render(0);
  defaultNode = "pcscf";
}

async function init() {
  await load_page();
}

init();

/// handle networkDefinitionForm ///
const networkDefinitionForm = document.getElementById(
  "network-definition-form"
);
networkDefinitionForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  const subnetmask = [];
  const gateway = [];

  gateway[0] = data.gateway_octet1;
  gateway[1] = data.gateway_octet2;
  gateway[2] = data.gateway_octet3;
  gateway[3] = data.gateway_octet4;

  subnetmask[0] = data.subnetmask_octet1;
  subnetmask[1] = data.subnetmask_octet2;
  subnetmask[2] = data.subnetmask_octet3;
  subnetmask[3] = data.subnetmask_octet4;

  const formData = {
    SubnetMask: subnetmask.join("."),
    Gateway: gateway.join("."),
  };

  const result = fetch(`${url}/api/topology/networkDefinition`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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

/// handle virtualIPsForm ///
const virtualIPsForm = document.getElementById("virtual-ips-form");
virtualIPsForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  const databaseVirtualIp = [];
  const dnsServerVirtualIp = [];
  const homerVirtualIp = [];

  databaseVirtualIp[0] = data.virtual_ips_database_octet1;
  databaseVirtualIp[1] = data.virtual_ips_database_octet2;
  databaseVirtualIp[2] = data.virtual_ips_database_octet3;
  databaseVirtualIp[3] = data.virtual_ips_database_octet4;

  dnsServerVirtualIp[0] = data.virtual_ips_dns_server_octet1;
  dnsServerVirtualIp[1] = data.virtual_ips_dns_server_octet2;
  dnsServerVirtualIp[2] = data.virtual_ips_dns_server_octet3;
  dnsServerVirtualIp[3] = data.virtual_ips_dns_server_octet4;

  homerVirtualIp[0] = data.virtual_ips_homer_octet1;
  homerVirtualIp[1] = data.virtual_ips_homer_octet2;
  homerVirtualIp[2] = data.virtual_ips_homer_octet3;
  homerVirtualIp[3] = data.virtual_ips_homer_octet4;

  const formData = {
    databaseVirtualIp: databaseVirtualIp.join("."),
    dnsVirtualIp: dnsServerVirtualIp.join("."),
    homerVirtualIp: homerVirtualIp.join("."),
  };

  fetch(`${url}/api/topology/virtualIps`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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

/// handle addNodeForm ///
const addNodeForm = document.getElementById("add-node-form");
addNodeForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  const nodeIp = [];
  nodeIp[0] = data.node_ip_octet1;
  nodeIp[1] = data.node_ip_octet2;
  nodeIp[2] = data.node_ip_octet3;
  nodeIp[3] = data.node_ip_octet4;

  const nodeName = data.node_name;
  const currentNodeType = data.node_type_icon;

  const formData = {
    name: nodeName,
    ip: nodeIp.join("."),
    type: currentNodeType,
  };
  const result = fetch(`${url}/api/topology/addNode`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  })
    .then((response) => {
      console.log(response);
      showError(response);
      return response.json();
    })
    .then((data) => {
      nodeType[nodeTypeName.indexOf(data.type)].push(data);
      render(nodeTypeName.indexOf(data.type));
    })
    .catch((error) => {
      console.log(error);
    });
});

/// handle node table ///
const nodeTypeName = ["pcscf", "rtpProxy", "core"];
let curNodeType;
const nodeTableTitlePcscf = document.getElementById("node-table-title-pcscf");
const nodeTableTitleRtpProxy = document.getElementById(
  "node-table-title-rtp-proxy"
);
const nodeTableTitleCore = document.getElementById("node-table-title-core");

nodeTableTitlePcscf.addEventListener("click", function (e) {
  e.preventDefault();
  nodeTableTitlePcscf.style.backgroundColor = "#A6D4C4";
  nodeTableTitleRtpProxy.style.backgroundColor = "#1F666E";
  nodeTableTitleCore.style.backgroundColor = "#1F666E";
  render(nodeTypeName.indexOf("pcscf"));
});

nodeTableTitleRtpProxy.addEventListener("click", function (e) {
  e.preventDefault();
  nodeTableTitleRtpProxy.style.backgroundColor = "#A6D4C4";
  nodeTableTitlePcscf.style.backgroundColor = "#1F666E";
  nodeTableTitleCore.style.backgroundColor = "#1F666E";
  render(nodeTypeName.indexOf("rtpProxy"));
});

nodeTableTitleCore.addEventListener("click", function (e) {
  e.preventDefault();
  nodeTableTitleCore.style.backgroundColor = "#A6D4C4";
  nodeTableTitleRtpProxy.style.backgroundColor = "#1F666E";
  nodeTableTitlePcscf.style.backgroundColor = "#1F666E";
  render(nodeTypeName.indexOf("core"));
});

let defaultNode = "pcscf";
let itemWillDeleteData = null;
const nodeTable = document.querySelector(".node-table");
nodeTable.addEventListener("click", function (event) {
  event.preventDefault();
  const target = event.target;
  if (target.classList.contains("trash")) {
    const data = nodeInfo.find((item) => {
      return item.id == target.id;
    });
    modal.style.display = "block";
    itemWillDeleteData = data;
  } else if (target.classList.contains("pencil")) {
    const closeIcon = document.getElementById(`${target.id}c`);
    const tickIcon = document.getElementById(`${target.id}t`);
    closeIcon.style.display = "block";
    tickIcon.style.display = "block";

    document.getElementById(`${target.id}name`).disabled = false;
    document.getElementById(`${target.id}ip`).disabled = false;
    document.getElementById(`${target.id}status`).disabled = false;

    const editableRowNumber = target.id.substring(0, target.id.length - 1);
    const currentTick = document.getElementById(`${target.id}t`);
    currentTick.addEventListener("click", function (event) {
      const editContentName =
        event.target.parentElement.parentElement.children[0].value;
      const editContentIp =
        event.target.parentElement.parentElement.children[1].value;
      const editContentStatus =
        event.target.parentElement.parentElement.children[2].value;

      const formdata = {
        name: editContentName,
        ip: editContentIp,
        type: curNodeType,
      };

      const editData = {
        editableRowNumber: editableRowNumber,
        editContentName: editContentName,
        editContentIp: editContentIp,
        editContentStatus: editContentStatus,
      };

      const result = fetch(`${url}/api/topology/editNode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formdata),
      })
        .then((response) => {
          showError(response);
          editNode(response, event, editData);
        })
        .catch((error) => {
          console.log(error);
        });
    });

    const currentClose = document.getElementById(`${target.id}c`);
    currentClose.addEventListener("click", function (e) {
      render(nodeTypeName.indexOf(curNodeType));
    });
  }
});

/// node modal ///
const modal = document.getElementById("node-modal");
const modalClose = document.querySelector(".node-modal-close");
const modalDeleteButton = document.getElementById("node-modal-delete-button");
const modalCancelButton = document.getElementById("node-modal-cancel-button");

modalClose.addEventListener("click", function (e) {
  e.preventDefault();
  modal.style.display = "none";
});

modalCancelButton.addEventListener("click", function (e) {
  e.preventDefault();
  modal.style.display = "none";
});

modalDeleteButton.addEventListener("click", function (e) {
  e.preventDefault();
  modal.style.display = "none";

  const formData = {
    name: itemWillDeleteData.name,
    ip: itemWillDeleteData.ip,
    type: itemWillDeleteData.type,
  };

  const result = fetch(`${url}/api/topology/deleteNode`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  })
    .then((response) => {
      showError(response);
      deleteNode(response);
    })
    .catch((error) => {
      console.log(error);
    });
});

/// get time ///
//   getTime();
//   setInterval(getTime, 60 * 1000 * 15);

/// error show ///
const errorClose = document.querySelector(".error-close-icon");
const errorElement = document.querySelector(".show-error");

errorClose.addEventListener("click", function (e) {
  e.preventDefault();
  errorElement.style.display = "none";
});

///////////////////////////////// toolbar icons ///////////////////////////////////////////////////////////

// /// exit ///
// const exitShow = document.querySelector(".exit");
// const exitIcon = document.getElementById("exit-icon");
// const exitConfirmButton = document.getElementById("exit-confirm-button");
// const exitCancelButton = document.getElementById("exit-cancel-button");

// exitIcon.addEventListener("click", function (e) {
//   e.preventDefault();
//   exitShow.style.display = "block";
// });

// exitConfirmButton.addEventListener("click", function (e) {
//   "use strict";
//   e.preventDefault();
//   const confirmResult = confirm("Are you sure you want to quit?");
//   if (confirmResult == true) {
//     window.close();
//   }
// });

// exitCancelButton.addEventListener("click", function (e) {
//   e.preventDefault();
//   exitShow.style.display = "none";
// });

// /// logout ///
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

// /// profile ///
// const profileShow = document.querySelector(".profile");
// const profileIcon = document.getElementById("profile-icon");
// const imageCloseIcon = document.getElementById("image-close");
// const imageTickIcon = document.getElementById("image-tick");
// const profileContentImages = document.querySelector(".profile-content-images");
// const accountInfoImg = document.querySelector(".sidebar-account-info-image");

// profileIcon.addEventListener("click", function (e) {
//   e.preventDefault();
//   profileShow.style.display = "block";
// });

// profileContentImages.addEventListener("click", function (e) {
//   e.preventDefault();
//   for (let i = 0; i < profileContentImages.children.length; i++) {
//     profileContentImages.children[i].style.backgroundColor = "#374775";
//   }

//   if (e.target.classList.contains("img-list")) {
//     const id = e.target.id;
//     e.target.style.backgroundColor = "white";

//     imageTickIcon.addEventListener("click", function (e) {
//       e.preventDefault();
//       accountInfoImg.setAttribute("src", `images/${id}.svg`);
//     });
//   }
// });

// imageCloseIcon.addEventListener("click", function (e) {
//   e.preventDefault();
//   for (let i = 0; i < 9; i++) {
//     profileContentImages.children[i].style.backgroundColor = "#374775";
//   }
//   profileContentImages.style.backgroundColor = "#374775";
//   profileShow.style.display = "none";
// });

// /// sound ///
// const soundShow = document.querySelector(".sound");
// const soundIcon = document.getElementById("sound-icon");
// const soundText = document.querySelector(".sound-text");
// const soundImg = soundIcon.children[0];
// let soundEnable = true;

// soundIcon.addEventListener("click", function (e) {
//   e.preventDefault();
//   soundShow.style.display = "block";

//   soundEnable = !soundEnable;

//   if (soundEnable === true) {
//     soundText.innerHTML = "System has unmuted!";
//     soundImg.setAttribute(
//       "src",
//       `images/IMS_TOPOLOGY_images/Title Bar Icon _ Sound.svg`
//     );
//   } else {
//     soundText.innerHTML = "System has muted!";
//     soundImg.setAttribute("src", `images/Title Bar Icon _ Sound OFF.svg`);
//   }

//   setTimeout(() => {
//     soundShow.style.display = "none";
//   }, 2000);
// });
