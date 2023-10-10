console.log("Hi");
let my_token;
let my_form = document.getElementById("my-form");
console.log(my_form);
my_form.addEventListener("submit", function (e) {
e.preventDefault();
const formData = Object.fromEntries(new FormData(e.target));
console.log(formData);
console.log(JSON.stringify(formData));

fetch("https://75f1b08b-e4e1-4506-af9e-8a4ed610dbb5.mock.pstmn.io/api/user/login?Content-Type=application/json", {
  method: 'POST',
  headers: {
   'Content-Type': 'application/json' 
 },
  body: JSON.stringify(formData),
})
.then((response) => response.json())
.then((data) => {console.log(data);
                 my_token = data.token ;
                 console.log(my_token);})
.then(() => {
  console.log("first");
  console.log(my_token);
  fetch("https://75f1b08b-e4e1-4506-af9e-8a4ed610dbb5.mock.pstmn.io/api/imsconfig", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${my_token}`
      }
  })
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
    });
  })
.catch((error) => {console.log(error)});
});