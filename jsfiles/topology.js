let network_Info = {};
let Subnetmask = [];
let Gateway = [];
let Node_IP = [];
let Node_Info;
let Node_Type;
let Database_Virtual_I = [];
let DNS_Server_Virtual_IP = [];
let Homer_Virtual_IP = [];
let node_type = [];

const url = "https://c6059f0c-d4f4-45f8-9187-a1d3da3b8645.mock.pstmn.io";
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
      network_Info = data;
      Node_Info = data.nodes;

      node_type[0] = Node_Info.filter((q) => q.type === "pcscf");
      node_type[1] = Node_Info.filter((q) => q.type === "rtpProxy");
      node_type[2] = Node_Info.filter((q) => q.type === "core");

      for (let i = 0; i < 4; i++) {
        Subnetmask[i] = document.getElementById(
          `network-definition-subnetmask-octet${i + 1}`
        );
        Subnetmask[i].setAttribute(
          "value",
          `${network_Info.subnetMask.split(".")[i]}`
        );

        Gateway[i] = document.getElementById(
          `network-definition-gateway-octet${i + 1}`
        );
        Gateway[i].setAttribute(
          "value",
          `${network_Info.gateway.split(".")[i]}`
        );

        Database_Virtual_I[i] = document.getElementById(
          `virtual-ips-database-octet${i + 1}`
        );
        Database_Virtual_I[i].setAttribute(
          "value",
          `${network_Info.databaseVirtualIp.split(".")[i]}`
        );

        DNS_Server_Virtual_IP[i] = document.getElementById(
          `virtual-ips-dns-server-octet${i + 1}`
        );
        DNS_Server_Virtual_IP[i].setAttribute(
          "value",
          `${network_Info.dnsVirtualIp.split(".")[i]}`
        );

        Homer_Virtual_IP[i] = document.getElementById(
          `virtual-ips-homer-octet${i + 1}`
        );
        Homer_Virtual_IP[i].setAttribute(
          "value",
          `${network_Info.homerVirtualIp.split(".")[i]}`
        );
      }
      render(0);
      default_node = "pcscf";
    })
    .catch((error) => {
      console.log("error");
    });
}

function showError(response) {
  if (response.status !== 200) {
    // hasMessage = true;
    showError.style.display = "block";
    showError.style.backgroundColor = "#c65161";
    const error_msg = document.getElementById("error-content");
    error_msg.innerHTML = `<img  src="images/error-logo.svg" class="error-icon"/>
            <p id="error-message">
            Your request was failed !! (status code : ${response.status})
            </p>`;
  } else {
    // hasMessage = false;
    showError.style.display = "block";
    showError.style.backgroundColor = "#58cc87";
    const success_msg = document.getElementById("error-content");
    success_msg.innerHTML = `<img  src="images/success Icon.svg" class="error-icon"/>
            <p id="error-message">
            Your request was done successfully !!
            </p>`;
  }
}

function render(type_index) {
  const render_table_type = node_type[type_index].map((q) => {
    return `<td class="d-block">
                  <div class="node-table-content">
                    <form
                     id="${q.id}edit-form"
                      class="d-flex  justify-content-between align-items-center"
                    >
                      <input
                        type="text"
                        id="${q.id}pname"
                        class="node-table-content-name"
                         value = "${q.name}"
                        disabled
                      />
                      <input
                        type="text"
                        id="${q.id}pip"
                        class="node-table-content-ip"
                        value= "${q.ip}"
                        disabled
                      />
                      <input
                        type="text"
                        id="${q.id}pstatus"
                        class="node-table-content-status"
                        value= "${q.status}"
                        disabled
                      />
                      <div class="node-table-content-icon d-flex flex-row">
                        <img
                          class="close"
                          id="${q.id}pc"
                          src="images/IMS_TOPOLOGY_images/close.svg"
                        />
                        <img
                          class="tick p-1"
                          id="${q.id}pt"
                          src="images/IMS_TOPOLOGY_images/tick.svg"
                        />
                        <img
                          class="pencil p-1"
                          id="${q.id}p"
                          src="images/IMS_TOPOLOGY_images/pencil.svg"
                        />
                        <img
                          class="trash p-1"
                          id="${q.id}"
                          src="images/IMS_TOPOLOGY_images/trash-simple.svg"
                        />
                      </div>
                    </form>
                  </div>
                </td>`;
  });

  const node_list = $("#node-table-contents");
  node_list.html(render_table_type.join(""));
  curNodeType = nodeTypeName[type_index];
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

async function init() {
  await load_page();
}

init();

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

  result = fetch(`${url}/api/topology/networkDefinition`, {
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

const nodeTypeName = ["pcscf", "rtpProxy", "core"];
let curNodeType;
// const nodeTable_title = [];
// for (let i = 0; i < nodeTypeName.length; i++) {
//   nodeTable_title[i] = document.getElementById(`node-table-title${i + 1}`);
//   nodeTable_title[i].addEventListener("click", function (e) {
//     e.preventDefault();

//     for (let i = 0; i < nodeTypeName.length; i++) {
//       nodeTable_title[i].style.backgroundColor = "#1F666E";
//     }

//     nodeTable_title[i].style.backgroundColor = "#A6D4C4";
//     render(i);
//   });
// }

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
  result = fetch(`${url}/api/topology/addNode`, {
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
      node_type[nodeTypeName.indexOf(data.type)].push(data);
      render(nodeTypeName.indexOf(data.type));
    })
    .catch((error) => {
      console.log(error);
    });
});

const modal = document.getElementById("node-modal");
let default_node = "pcscf";
let itemWillDeleteData = null;

let editable_data_before = {};
let editable_data_next = {};
let editable_form_number;
const modalClose = document.querySelector(".node-modal-close");
const modalDeleteButton = document.getElementById("node-modal-delete-button");
const modalCancelButton = document.getElementById("node-modal-cancel-button");
const nodeTable = document.querySelector(".node-table");

nodeTable.addEventListener("click", function (e) {
  e.preventDefault();
  const target = e.target;
  if (target.classList.contains("trash")) {
    const data = Node_Info.find((item) => {
      return item.id == target.id;
    });
    modal.style.display = "block";
    itemWillDeleteData = data;
  } else if (target.classList.contains("pencil")) {
    const close_icon = document.getElementById(`${target.id}c`);
    const tick_icon = document.getElementById(`${target.id}t`);
    close_icon.style.display = "block";
    tick_icon.style.display = "block";
    editable_data_before = Node_Info.find((item) => {
      return item.id == target.id.substring(0, target.id.length - 1);
    });

    document.getElementById(`${target.id}name`).disabled = false;
    document.getElementById(`${target.id}ip`).disabled = false;
    document.getElementById(`${target.id}status`).disabled = false;
    editable_row_number = target.id.substring(0, target.id.length - 1);
    // console.log("hiiiiiiiiiiiiiiiiiiii");
    // console.log(editable_row_number);
    // console.log(node_type[0]);

    const current_tick = document.getElementById(`${target.id}t`);
    current_tick.addEventListener("click", function (e) {
      const edit_content_name =
        e.target.parentElement.parentElement.children[0].value;
      const edit_content_ip =
        e.target.parentElement.parentElement.children[1].value;
      const edit_content_status =
        e.target.parentElement.parentElement.children[2].value;

      const final_formdata = {
        name: edit_content_name,
        ip: edit_content_ip,
        type: curNodeType,
      };

      hasMessage = false;
      result = fetch(`${url}/api/topology/editNode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(final_formdata),
      }).then((response) => {
        if (response.status !== 200) {
          showError.style.display = "block";
          showError.style.backgroundColor = "#c65161";
          const error_msg = document.getElementById("error-content");
          error_msg.innerHTML = `<img  src="images/error-logo.svg" class="error-icon"/>
                        <p id="error-message">
                        Your request was failed (status code : ${response.status})
                        </p>`;
          render(nodeTypeName.indexOf(curNodeType));
        } else {
          showError.style.display = "block";
          showError.style.backgroundColor = "#58cc87";
          const success_msg = document.getElementById("error-content");
          success_msg.innerHTML = `<img  src="images/success Icon.svg" class="error-icon"/>
                        <p id="error-message">
                        Your request was done successfully!
                        </p>`;

          let desired_row = node_type[
            nodeTypeName.indexOf(curNodeType)
          ].findIndex((q) => q.id == editable_row_number);

          // console.log("hiiiiiiiiiiiiiiiiiiii");
          // console.log(desired_row);
          node_type[nodeTypeName.indexOf(curNodeType)][desired_row].name =
            edit_content_name;
          node_type[nodeTypeName.indexOf(curNodeType)][desired_row].ip =
            edit_content_ip;
          node_type[nodeTypeName.indexOf(curNodeType)][desired_row].status =
            edit_content_status;
          e.target.parentElement.parentElement.children[0].disabled = true;
          e.target.parentElement.parentElement.children[1].disabled = true;
          e.target.parentElement.parentElement.children[2].disabled = true;
          render(nodeTypeName.indexOf(curNodeType));
        }
      });
    });

    const current_close = document.getElementById(`${target.id}c`);
    current_close.addEventListener("click", function (e) {
      render(nodeTypeName.indexOf(curNodeType));
    });
  }
});

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

  let hasMessage = false;
  const formData = {
    name: itemWillDeleteData.name,
    ip: itemWillDeleteData.ip,
    type: itemWillDeleteData.type,
  };

  result = fetch(`${url}/api/topology/deleteNode`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  })
    .then((response) => {
      if (response.status !== 200) {
        showError.style.display = "block";
        showError.style.backgroundColor = "#c65161";
        const error_msg = document.getElementById("error-content");
        error_msg.innerHTML = `<img  src="images/error-logo.svg" class="error-icon"/>
              <p id="error-message">
              Your request was failed (status code : ${response.status})
              </p>`;
      } else {
        showError.style.display = "block";
        showError.style.backgroundColor = "#58cc87";
        const success_msg = document.getElementById("error-content");
        success_msg.innerHTML = `<img  src="images/success Icon.svg" class="error-icon"/>
                <p id="error-message">
                Your request was done successfully!
                </p>`;
        let index = nodeTypeName.findIndex(
          (num) => num === itemWillDeleteData.type
        );
        node_type[index] = node_type[index].filter(
          (q) =>
            !(
              q.type === itemWillDeleteData.type &&
              q.name === itemWillDeleteData.name &&
              q.ip === itemWillDeleteData.ip
            ) === true
        );
        render(index);
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

//   getTime();
//   setInterval(getTime, 60 * 1000 * 15);

const errorClose = document.querySelector(".error-close-icon");
const showError = document.querySelector(".show-error");

errorClose.addEventListener("click", function (e) {
  e.preventDefault();
  showError.style.display = "none";
});

///////////////////////////////// toolbar icons///////////////////

const exitShow = document.querySelector(".exit");
const exitIcon = document.getElementById("exit-icon");
const exitConfirmButton = document.getElementById("exit-confirm-button");
const exitCancelButton = document.getElementById("exit-cancel-button");

exitIcon.addEventListener("click", function (e) {
  e.preventDefault();
  exitShow.style.display = "block";
});

exitConfirmButton.addEventListener("click", function (e) {
  "use strict";
  e.preventDefault();
  const confirmResult = confirm("Are you sure you want to quit?");
  if (confirmResult == true) {
    window.close();
  }
});

exitCancelButton.addEventListener("click", function (e) {
  e.preventDefault();
  exitShow.style.display = "none";
});

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
    profileContentImages.children[i].style.backgroundColor = "#374775";
  }

  if (e.target.classList.contains("img-list")) {
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
    profileContentImages.children[i].style.backgroundColor = "#374775";
  }
  profileContentImages.style.backgroundColor = "#374775";
  profileShow.style.display = "none";
});

const soundShow = document.querySelector(".sound");
const soundIcon = document.getElementById("sound-icon");
const soundText = document.querySelector(".sound-text");
const soundImg = soundIcon.children[0];

let sound_enable = true;

soundIcon.addEventListener("click", function (e) {
  e.preventDefault();
  soundShow.style.display = "block";

  sound_enable = !sound_enable;

  if (sound_enable === true) {
    soundText.innerHTML = "System has unmuted!";
    soundImg.setAttribute(
      "src",
      `images/IMS_TOPOLOGY_images/Title Bar Icon _ Sound.svg`
    );
  } else {
    soundText.innerHTML = "System has muted!";
    soundImg.setAttribute("src", `images/Title Bar Icon _ Sound OFF.svg`);
  }

  setTimeout(() => {
    soundShow.style.display = "none";
  }, 2000);
});
