let network_Info = {};
let Subnetmask = [];
let Gateway = [];
let Node_IP = [];
let Node_Name;
let Node_Info;
let Node_Type;
let Database_Virtual_I = [];
let DNS_Server_Virtual_IP = [];
let Homer_Virtual_IP = [];
let node_type = [];

const url = "https://c6059f0c-d4f4-45f8-9187-a1d3da3b8645.mock.pstmn.io";
let my_token = localStorage.getItem("token");

function load_page() {
  fetch(`${url}/api/topology`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${my_token}`,
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
  cur_node_type = node_type_name[type_index];
}

function getTime() {
  fetch(`${url}/api/general`)
    .then((response) => response.json())
    .then((data) => {
      time_Info = data;
      const my_global_hour = time_Info.timeHour;
      const my_global_min = time_Info.timeMin;
      const my_global_sec = time_Info.timeSec;

      let my_local_hour;
      let my_local_min;
      let my_local_sec;

      if (time_Info.timeZone === "Iran") {
        my_local_hour = time_Info.timeHour + 3;
        my_local_min = time_Info.timeMin + 30;
        my_local_sec = time_Info.timeSec;
      }

      if (my_local_hour < 10) {
        my_local_hour = `0${my_local_hour}`;
      }

      if (my_local_min < 10) {
        my_local_min = `0${my_local_min}`;
      }

      if (my_local_sec < 10) {
        my_local_sec = `0${my_local_sec}`;
      }

      if (my_global_hour < 10) {
        my_global_hour = `0${my_global_hour}`;
      }

      if (my_global_min < 10) {
        my_global_min = `0${my_global_min}`;
      }

      if (my_global_sec < 10) {
        my_global_sec = `0${my_global_sec}`;
      }

      const local_time = document.getElementById("local-time");
      const global_time = document.getElementById("global-time");

      local_time.innerHTML = `${my_local_hour}:${my_local_min}:${my_local_sec}`;
      global_time.innerHTML = `${my_global_hour}:${my_global_min}:${my_global_sec}`;
    })
    .catch((error) => {
      console.log("error");
    });
}

async function init() {
  await load_page();
}

init();

const Network_Definition_form = document.getElementById(
  "network-definition-form"
);
Network_Definition_form.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = Object.fromEntries(new FormData(e.target));
  const subnetmak = [];
  const gateway = [];

  gateway[0] = formData.gateway_field1;
  gateway[1] = formData.gateway_field2;
  gateway[2] = formData.gateway_field3;
  gateway[3] = formData.gateway_field4;

  subnetmak[0] = formData.subnetmask_field1;
  subnetmak[1] = formData.subnetmask_field2;
  subnetmak[2] = formData.subnetmask_field3;
  subnetmak[3] = formData.subnetmask_field4;

  const final_formdata = {
    SubnetMask: subnetmak.join("."),
    Gateway: gateway.join("."),
  };
  // hasMessage = false;
  console.log(final_formdata);

  result = fetch(`${url}/api/topology/networkDefinition`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${my_token}`,
    },
    body: JSON.stringify(final_formdata),
  })
    .then((response) => {
      console.log(response);
      showError(response);
    })
    .catch((error) => {
      console.log(error);
    });
});

const Virtual_IPs_form = document.getElementById("virtual-ips-form");
Virtual_IPs_form.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = Object.fromEntries(new FormData(e.target));
  const DatabaseVirtualIP = [];
  const DNSServerVirtualIP = [];
  const HomerVirtualIP = [];

  DatabaseVirtualIP[0] = formData.Virtual_IPs_Database_field1;
  DatabaseVirtualIP[1] = formData.Virtual_IPs_Database_field2;
  DatabaseVirtualIP[2] = formData.Virtual_IPs_Database_field3;
  DatabaseVirtualIP[3] = formData.Virtual_IPs_Database_field4;

  DNSServerVirtualIP[0] = formData.Virtual_IPs_DNSserver_field1;
  DNSServerVirtualIP[1] = formData.Virtual_IPs_DNSserver_field2;
  DNSServerVirtualIP[2] = formData.Virtual_IPs_DNSserver_field3;
  DNSServerVirtualIP[3] = formData.Virtual_IPs_DNSserver_field4;

  HomerVirtualIP[0] = formData.Virtual_IPs_Homer_field1;
  HomerVirtualIP[1] = formData.Virtual_IPs_Homer_field2;
  HomerVirtualIP[2] = formData.Virtual_IPs_Homer_field3;
  HomerVirtualIP[3] = formData.Virtual_IPs_Homer_field4;

  const final_formdata = {
    databaseVirtualIp: DatabaseVirtualIP.join("."),
    dnsVirtualIp: DNSServerVirtualIP.join("."),
    homerVirtualIp: HomerVirtualIP.join("."),
  };

  fetch(`${url}/api/topology/virtualIps`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${my_token}`,
    },
    body: JSON.stringify(final_formdata),
  })
    .then((response) => {
      console.log(response);
      showError(response);
    })
    .catch((error) => {
      console.log(error);
    });
});

const node_type_name = ["pcscf", "rtpProxy", "core"];
let cur_node_type;
const node_table_title = [];
for (let i = 0; i < node_type_name.length; i++) {
  node_table_title[i] = document.getElementById(`node-table-title${i + 1}`);
  node_table_title[i].addEventListener("click", function (e) {
    e.preventDefault();

    for (let i = 0; i < node_type_name.length; i++) {
      node_table_title[i].style.backgroundColor = "#1F666E";
    }

    node_table_title[i].style.backgroundColor = "#A6D4C4";
    render(i);
  });
}

let new_Node;
const add_node_form = document.getElementById("add-node-form");
add_node_form.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = Object.fromEntries(new FormData(e.target));

  let node_ip = [];
  let node_name;
  let current_node_type;

  node_name = formData.node_name;
  current_node_type = formData.node_type_icon;

  node_ip[0] = formData.IP_Address_field1;
  node_ip[1] = formData.IP_Address_field2;
  node_ip[2] = formData.IP_Address_field3;
  node_ip[3] = formData.IP_Address_field4;

  const final_formdata = {
    name: node_name,
    ip: node_ip.join("."),
    type: current_node_type,
  };
  result = fetch(`${url}/api/topology/addNode`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${my_token}`,
    },
    body: JSON.stringify(final_formdata),
  })
    .then((response) => {
      console.log(response);
      showError(response);
      return response.json();
    })
    .then((data) => {
      new_Node = data;
      node_type[node_type_name.indexOf(new_Node.type)].push(new_Node);
      render(node_type_name.indexOf(new_Node.type));
    })
    .catch((error) => {
      console.log(error);
    });
});

const modal = document.getElementById("modal");
let default_node = "pcscf";
let itemWillDeleteData = null;

let editable_data_before = {};
let editable_data_next = {};
let editable_form_number;
const modal_close = document.querySelector(".modal-close");
const modal_delete_button = document.getElementById("modal-delete-button");
const modal_cancel_button = document.getElementById("modal-cancel-button");
const node_table = document.querySelector(".node-table");

node_table.addEventListener("click", function (e) {
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

    const current_tick = document.getElementById(`${target.id}t`);
    current_tick.addEventListener("click", function (e) {
      let edit_content_name =
        e.target.parentElement.parentElement.children[0].value;
      let edit_content_ip =
        e.target.parentElement.parentElement.children[1].value;
      let edit_content_status =
        e.target.parentElement.parentElement.children[2].value;

      const final_formdata = {
        name: edit_content_name,
        ip: edit_content_ip,
        type: cur_node_type,
      };

      hasMessage = false;
      result = fetch(`${url}/api/topology/editNode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${my_token}`,
        },
        body: JSON.stringify(final_formdata),
      }).then((response) => {
        if (response.status !== 200) {
          show_error.style.display = "block";
          show_error.style.backgroundColor = "#c65161";
          let error_msg = document.getElementById("error-content");
          error_msg.innerHTML = `<img  src="images/error-logo.svg" class="error-logo"/>
                        <p id="erroe-message">
                        Your request was failed (status code : ${response.status})
                        </p>`;
          render(node_type_name.indexOf(cur_node_type));
        } else {
          show_error.style.display = "block";
          show_error.style.backgroundColor = "#58cc87";
          let success_msg = document.getElementById("error-content");
          success_msg.innerHTML = `<img  src="images/success Icon.svg" class="error-logo"/>
                        <p id="erroe-message">
                        Your request was done successfully!
                        </p>`;

          let desired_row = node_type[0].findIndex(
            (q) => q.id == editable_row_number
          );
          node_type[node_type_name.indexOf(cur_node_type)][desired_row].name =
            edit_content_name;
          node_type[node_type_name.indexOf(cur_node_type)][desired_row].ip =
            edit_content_ip;
          node_type[node_type_name.indexOf(cur_node_type)][desired_row].status =
            edit_content_status;
          e.target.parentElement.parentElement.children[0].disabled = true;
          e.target.parentElement.parentElement.children[1].disabled = true;
          e.target.parentElement.parentElement.children[2].disabled = true;
          render(node_type_name.indexOf(cur_node_type));
        }
      });
    });

    const current_close = document.getElementById(`${target.id}c`);
    current_close.addEventListener("click", function (e) {
      render(node_type_name.indexOf(cur_node_type));
    });
  }
});

modal_close.addEventListener("click", function (e) {
  e.preventDefault();
  modal.style.display = "none";
});

modal_cancel_button.addEventListener("click", function (e) {
  e.preventDefault();
  modal.style.display = "none";
});

modal_delete_button.addEventListener("click", function (e) {
  e.preventDefault();
  modal.style.display = "none";

  let hasMessage = false;
  const final_formdata = {
    name: itemWillDeleteData.name,
    ip: itemWillDeleteData.ip,
    type: itemWillDeleteData.type,
  };

  result = fetch(`${url}/api/topology/deleteNode`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${my_token}`,
    },
    body: JSON.stringify(final_formdata),
  })
    .then((response) => {
      if (response.status !== 200) {
        show_error.style.display = "block";
        show_error.style.backgroundColor = "#c65161";
        const error_msg = document.getElementById("error-content");
        error_msg.innerHTML = `<img  src="images/error-logo.svg" class="error-logo"/>
              <p id="erroe-message">
              Your request was failed (status code : ${response.status})
              </p>`;
      } else {
        show_error.style.display = "block";
        show_error.style.backgroundColor = "#58cc87";
        const success_msg = document.getElementById("error-content");
        success_msg.innerHTML = `<img  src="images/success Icon.svg" class="error-logo"/>
                <p id="erroe-message">
                Your request was done successfully!
                </p>`;
        let index = node_type_name.findIndex(
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

const error_close = document.querySelector(".error-close-icon");
const show_error = document.querySelector(".show-error");

error_close.addEventListener("click", function (e) {
  e.preventDefault();
  show_error.style.display = "none";
});

///////////////////////////////// toolbar icons///////////////////

const exit_show = document.querySelector(".exit");
const exit_icon = document.getElementById("exit-icon");
const exit_confirm_button = document.getElementById("exit-confirm-button");
const exit_cancel_button = document.getElementById("exit-cancel-button");

exit_icon.addEventListener("click", function (e) {
  e.preventDefault();
  exit_show.style.display = "block";
});

exit_confirm_button.addEventListener("click", function (e) {
  "use strict";
  e.preventDefault();
  var confirm_result = confirm("Are you sure you want to quit?");
  if (confirm_result == true) {
    window.close();
  }
});

exit_cancel_button.addEventListener("click", function (e) {
  e.preventDefault();
  exit_show.style.display = "none";
});

const log_out_show = document.querySelector(".log-out");
const log_out_icon = document.getElementById("log-out-icon");
const log_out_confirm_button = document.getElementById(
  "log-out-confirm-button"
);
const log_out_cancel_button = document.getElementById("log-out-cancel-button");

log_out_icon.addEventListener("click", function (e) {
  e.preventDefault();
  log_out_show.style.display = "block";
});

log_out_confirm_button.addEventListener("click", function (e) {
  e.preventDefault();
  localStorage.removeItem("token");
  $("head").append(
    `<meta http-equiv="refresh" content="0; URL=Login Page – Language Toggle.html" />`
  );
});

log_out_cancel_button.addEventListener("click", function (e) {
  e.preventDefault();
  log_out_show.style.display = "none";
});

const profile_show = document.querySelector(".profile");
const profile_icon = document.getElementById("profile-icon");
const image_close_icon = document.getElementById("image-close");
const image_tick_icon = document.getElementById("image-tick");
const profile_content_images = document.querySelector(
  ".profile-content-images"
);
const Account_info_img = document.querySelector(".sidebar-account-info-image");

profile_icon.addEventListener("click", function (e) {
  e.preventDefault();
  profile_show.style.display = "block";
});

profile_content_images.addEventListener("click", function (e) {
  e.preventDefault();
  for (let i = 0; i < profile_content_images.children.length; i++) {
    profile_content_images.children[i].style.backgroundColor = "#374775";
  }

  if (e.target.classList.contains("img-list")) {
    const id = e.target.id;
    e.target.style.backgroundColor = "white";

    image_tick_icon.addEventListener("click", function (e) {
      e.preventDefault();
      Account_info_img.setAttribute("src", `images/${id}.svg`);
    });
  }
});

image_close_icon.addEventListener("click", function (e) {
  e.preventDefault();
  for (let i = 0; i < 9; i++) {
    profile_content_images.children[i].style.backgroundColor = "#374775";
  }
  profile_content_images.style.backgroundColor = "#374775";
  profile_show.style.display = "none";
});

const sound_show = document.querySelector(".sound");
const sound_icon = document.getElementById("sound-icon");
const sound_text = document.querySelector(".sound-text");
const sound_img = sound_icon.children[0];

let sound_enable = true;

sound_icon.addEventListener("click", function (e) {
  e.preventDefault();
  sound_show.style.display = "block";

  sound_enable = !sound_enable;

  if (sound_enable === true) {
    sound_text.innerHTML = "System has unmuted!";
    sound_img.setAttribute(
      "src",
      `images/IMS_TOPOLOGY_images/Title Bar Icon _ Sound.svg`
    );
  } else {
    sound_text.innerHTML = "System has muted!";
    sound_img.setAttribute("src", `images/Title Bar Icon _ Sound OFF.svg`);
  }

  setTimeout(() => {
    sound_show.style.display = "none";
  }, 2000);
});
