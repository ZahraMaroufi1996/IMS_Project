      const url = "https://98401295-f480-4dc2-9243-a8bca787ee46.mock.pstmn.io" ;
      let my_token;
      let my_form = document.getElementById("login-form");
      my_form.addEventListener("submit", function (e) {
        e.preventDefault();
        const formData = Object.fromEntries(new FormData(e.target));
        console.log(formData);
        console.log(JSON.stringify(formData));

        fetch(
          `${url}/api/login?Content-Type=application/json`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        )
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            my_token = data.token;
            console.log(my_token);
            localStorage.setItem('token', my_token);
            $("head").append(`<meta http-equiv="refresh" content="0; URL=IMS_TOPOLOGY.html" />`);
          })
          .catch((error) => {
            console.log(error);
          });
      });