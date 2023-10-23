let network_Info = {};
      let ims_Domain;
      let Encryption_Algorithms = [];
      let pcscf_Shared_Memory, icscf_Shared_Memory, scscf_Shared_Memory;
      let pcscf_Private_Memory, icscf_Private_Memory, scscf_Private_Memory;
      let PCRF_IP_Address = [];
      let PCRF_FQDN;
      let PCRF_Realm;
      let Transport_Protocol = [];
      let Enable_SRTP,
        Enable_IPsec,
        Enable_Rx_Source_Port,
        Enable_TLS,
        Enable_CallDuration,
        CallDuration,
        LossTimeout;
      let Minimum_Register_Time, Maximum_Register_Time;
      let Supported_HD_Codes = [];
      let inbound_Port_Minimum, inbound_Port_Maximum;
      let outbound_Port_Minimum, outbound_Port_Maximum;
      const url = "https://98401295-f480-4dc2-9243-a8bca787ee46.mock.pstmn.io";
      let my_token = localStorage.getItem('token');
      console.log(my_token);

      function load_page() {
        fetch(`${url}/api/configuration` ,  {
              method: "GET",
              headers: {
              "Authorization": `Bearer ${my_token}`
              }
             })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            network_Info = data;

            ims_Domain = document.querySelector(
              `.General-class-content-field1-box`
            );
            ims_Domain.setAttribute("value", `${network_Info.domain}`);

            let Enable_Homer_In1 = [];
            Enable_Homer_In1 = document.getElementsByName(`General-type-icon1`);

            let Enable_Homer_In2 = [];
            Enable_Homer_In2 = document.getElementsByName(`General-type-icon2`);

            let Enable_Homer_In3 = [];
            Enable_Homer_In3 = document.getElementsByName(`General-type-icon3`);

            let Enable_Homer_In = [
              Enable_Homer_In1[0],
              Enable_Homer_In2[0],
              Enable_Homer_In3[0],
            ];

            for (let i = 0; i < network_Info.homerEnable.length; i++) {
              for (let j = 0; j < Enable_Homer_In.length; j++) {
                if (Enable_Homer_In[j].value === network_Info.homerEnable[i]) {
                  Enable_Homer_In[j].checked = true;
                }
              }
            }

            let Encryption_Algorithm1 = [];
            Encryption_Algorithm1 = document.getElementsByName(
              `Encryption-Algorithm-type-icon1`
            );

            let Encryption_Algorithm2 = [];
            Encryption_Algorithm2 = document.getElementsByName(
              `Encryption-Algorithm-type-icon2`
            );

            let Encryption_Algorithm3 = [];
            Encryption_Algorithm3 = document.getElementsByName(
              `Encryption-Algorithm-type-icon3`
            );

            Encryption_Algorithms = [
              Encryption_Algorithm1[0],
              Encryption_Algorithm2[0],
              Encryption_Algorithm3[0],
            ];

            for (let i = 0; i < network_Info.pcscf.algorithms.length; i++) {
              for (let j = 0; j < Encryption_Algorithms.length; j++) {
                if (
                  Encryption_Algorithms[j].value ===
                  network_Info.pcscf.algorithms[i]
                ) {
                  Encryption_Algorithms[j].checked = true;
                }
              }
            }

            Transport_Protocol =
              document.getElementsByName("Transport_Protocol");
            for (let i = 0; i < Transport_Protocol.length; i++) {
              {
                if (
                  Transport_Protocol[i].value ===
                  network_Info.pcscf.rxConfiguration.protocol
                ) {
                  Transport_Protocol[i].checked = true;
                }
              }
            }

            let Supported_HD_Code1 = [];
            Supported_HD_Code1 = document.getElementsByName(
              `Supported-HD-Codecs-type-icon1`
            );

            let Supported_HD_Code2 = [];
            Supported_HD_Code2 = document.getElementsByName(
              `Supported-HD-Codecs-type-icon2`
            );

            Supported_HD_Codes = [Supported_HD_Code1[0], Supported_HD_Code2[0]];

            for (
              let i = 0;
              i < network_Info.rtpProxy.supportedHdCoders.length;
              i++
            ) {
              for (let j = 0; j < Supported_HD_Codes.length; j++) {
                if (
                  Supported_HD_Codes[j].value ===
                  network_Info.rtpProxy.supportedHdCoders[i]
                ) {
                  Supported_HD_Codes[j].checked = true;
                }
              }
            }

            for (let i = 0; i < 4; i++) {
              PCRF_IP_Address[i] = document.querySelector(
                `.PCRF-IP-Address-box${4 - i}`
              );
              PCRF_IP_Address[i].setAttribute(
                "value",
                `${network_Info.pcscf.rxConfiguration.ip.split(".")[i]}`
              );
            }

            Enable_IPsec = document.getElementById("ipsec");
            // console.log(Enable_IPsec);
            if (network_Info.pcscf.ipSec === true) {
              Enable_IPsec.checked = true;
            }

            Enable_TLS = document.getElementById("tls");
            if (network_Info.pcscf.tls === true) {
              Enable_TLS.checked = true;
            }

            Enable_Rx_Source_Port = document.getElementById(
              "Enable-Rx-Source-Port"
            );
            if (network_Info.pcscf.rxConfiguration.sourcePortEnabled === true) {
              Enable_Rx_Source_Port.checked = true;
            }

            Enable_SRTP = document.getElementById("srtp");
            if (network_Info.rtpProxy.srtp === true) {
              Enable_SRTP.checked = true;
            }

            Enable_CallDuration = document.getElementById(
              "Enable-Call-Duration"
            );
            if (network_Info.rtpProxy.maximumCallDurationEnable === true) {
              Enable_CallDuration.checked = true;
            }

            pcscf_Shared_Memory = document.getElementById(
              "pcscf-shared-memory"
            );
            pcscf_Shared_Memory.setAttribute(
              "value",
              `${network_Info.pcscf.shareMemory}`
            );
            pcscf_Private_Memory = document.getElementById(
              "pcscf-private-memory"
            );
            pcscf_Private_Memory.setAttribute(
              "value",
              `${network_Info.pcscf.privateMemory}`
            );

            scscf_Shared_Memory = document.getElementById(
              "scscf-shared-memory"
            );
            scscf_Shared_Memory.setAttribute(
              "value",
              `${network_Info.scscf.shareMemory}`
            );
            scscf_Private_Memory = document.getElementById(
              "scscf-private-memory"
            );
            scscf_Private_Memory.setAttribute(
              "value",
              `${network_Info.scscf.privateMemory}`
            );

            icscf_Shared_Memory = document.getElementById(
              "icscf-shared-memory"
            );
            icscf_Shared_Memory.setAttribute(
              "value",
              `${network_Info.icscf.shareMemory}`
            );
            icscf_Private_Memory = document.getElementById(
              "icscf-private-memory"
            );
            icscf_Private_Memory.setAttribute(
              "value",
              `${network_Info.icscf.privateMemory}`
            );

            Minimum_Register_Time = document.getElementById(
              "Minimum-Register-Time"
            );
            Minimum_Register_Time.setAttribute(
              "value",
              `${network_Info.scscf.minimumRegisterTime}`
            );
            Maximum_Register_Time = document.getElementById(
              "Maximum-Register-Time"
            );
            Maximum_Register_Time.setAttribute(
              "value",
              `${network_Info.scscf.maximumRegisterTime}`
            );

            inbound_Port_Minimum = document.getElementById(
              "Inbound-Port-Minimum"
            );
            inbound_Port_Minimum.setAttribute(
              "value",
              `${network_Info.rtpProxy.inboundPortMinimum}`
            );
            inbound_Port_Maximum = document.getElementById(
              "Inbound-Port-Maximum"
            );
            inbound_Port_Maximum.setAttribute(
              "value",
              `${network_Info.rtpProxy.inboundPortMaximum}`
            );

            outbound_Port_Minimum = document.getElementById(
              "Outbound-Port-Minimum"
            );
            outbound_Port_Minimum.setAttribute(
              "value",
              `${network_Info.rtpProxy.outboundPortMinimum}`
            );
            outbound_Port_Maximum = document.getElementById(
              "Outbound-Port-Maximum"
            );
            outbound_Port_Maximum.setAttribute(
              "value",
              `${network_Info.rtpProxy.outboundPortMaximum}`
            );

            CallDuration = document.getElementById("Call-Duration");
            CallDuration.setAttribute(
              "value",
              `${network_Info.rtpProxy.maximumCallDuration}`
            );
            LossTimeout = document.getElementById("RTP-Loss-Timeout");
            LossTimeout.setAttribute(
              "value",
              `${network_Info.rtpProxy.rtpLossTimeout}`
            );

            Rx_Source_Port = document.getElementById("Rx-Source-Port");
            Rx_Source_Port.setAttribute(
              "value",
              `${network_Info.pcscf.rxConfiguration.sourcePort}`
            );

            PCRF_FQDN = document.getElementById("Rx-configuration-field2");
            PCRF_FQDN.setAttribute(
              "value",
              `${network_Info.pcscf.rxConfiguration.sourcePort}`
            );

            PCRF_Realm = document.getElementById("Rx-configuration-field3");
            PCRF_Realm.setAttribute(
              "value",
              `${network_Info.pcscf.rxConfiguration.sourcePort}`
            );
          })
          .catch((error) => {
            console.log(error);
          });
      }

      async function init() {
        await load_page();
      }

      init();


      /////////////////////////////////////// edit -icon /////////////////////////////////////

      let edit_btn = document.querySelector(".information-edit-button");
      edit_btn.addEventListener("click", function (e) {
        e.preventDefault();
        const all_inputs = document.getElementsByTagName("input");
        for (let i = 0; i < all_inputs.length; i++) {
          all_inputs[i].disabled = false;
        }
      });

      ///////////////////////////////////////// error show /////////////////////////

      let error_close = document.querySelector(".error-close");
      let show_error = document.querySelector(".show-error");

      error_close.addEventListener("click", function (e) {
        e.preventDefault();
        show_error.style.display = "none";
      });

    

      ////////////////////////////////// save icon ////////////////////////////////////

      let total_form = document.getElementById("total-form");
      total_form.addEventListener("submit", function (e) {
        e.preventDefault();
        const formData = Object.fromEntries(new FormData(e.target));
        let hasMessage = false;
        let result = fetch(`${url}/api/configuration/submittForm`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
             "Authorization": `Bearer ${my_token}`
          },
          body: JSON.stringify(formData),
        })
          .then((response) => {
            console.log(response);
            // console.log(response.status) ;
            if (response.status !== 200) {
              hasMessage = true;
              show_error.style.display = "block";
              show_error.style.backgroundColor = "#c65161";
              let error_msg = document.getElementById("erroe-message");
              error_msg.innerHTML =
                `Your request was failed (status code : ${response.status}) ` +
                `<img  src="images/About Icon.svg" class="error-logo"/>`;
            } else {
              hasMessage = false;
              show_error.style.display = "block";
              show_error.style.backgroundColor = "#58cc87";
              let success_msg = document.getElementById("erroe-message");
              success_msg.innerHTML =
                "Your request was done successfully" +
                `<img  src="images/About Icon.svg" class="error-logo"/>`;
            }
          })
          .catch((error) => {
            console.log(error);
          });
      });

      function getTime() {
        fetch(`${url}/api/general`)
          .then((response) => response.json())
          .then((data) => {
            time_Info = data;
            // console.log(data);
            let my_global_hour = time_Info.timeHour;
            let my_global_min = time_Info.timeMin;
            let my_global_sec = time_Info.timeSec;

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

            let local_time = document.getElementById("local-time");
            let global_time = document.getElementById("global-time");

            local_time.innerHTML = `${my_local_hour}:${my_local_min}:${my_local_sec}`;
            global_time.innerHTML = `${my_global_hour}:${my_global_min}:${my_global_sec}`;
          })
          .catch((error) => {
            console.log("error");
          });
      }

    //   getTime();
    //   setInterval(getTime, 60 * 1000 * 15);

    let exit_show =  document.querySelector(".exit");
    let exit_icon =  document.getElementById("exit-icon");
    let exit_button =  document.querySelector(".exit-button");
    let exit_cancel_button =  document.querySelector(".exit-cancel-button");


    let log_out_show =  document.querySelector(".log-out");
    let log_out_icon =  document.getElementById("log-out-icon");
    let log_out_button =  document.querySelector(".log-out-button");
    let log_out_cancel_button =  document.querySelector(".log-out-cancel-button");


    exit_icon.addEventListener("click", function (e) {
        e.preventDefault();
        exit_show.style.display = "block";
      });

     exit_button.addEventListener("click", function (e) {
        'use strict';
        e.preventDefault();
        console.log("hiiii in exit")
        var confirm_result = confirm("Are you sure you want to quit?");
        if (confirm_result == true) {
            window.close();
        }
    });

    exit_cancel_button.addEventListener("click", function (e) {
        e.preventDefault();
        exit_show.style.display = "none";
      });


    log_out_icon.addEventListener("click", function (e) {
        e.preventDefault();
        log_out_show.style.display = "block";
      });

    log_out_button.addEventListener("click", function (e) {
        e.preventDefault();
        localStorage.removeItem('token');
        $("head").append(`<meta http-equiv="refresh" content="0; URL=Login Page – Language Toggle.html" />`);
      });


    log_out_cancel_button.addEventListener("click", function (e) {
        e.preventDefault();
         log_out_show.style.display  = "none";
      });
