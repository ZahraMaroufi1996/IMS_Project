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
  $("head").append(`<meta http-equiv="refresh" content="0; URL=login.html" />`);
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
