const $onlyMoodsButton = document.querySelector(".only__moods");

$onlyMoodsButton.addEventListener("click", () => {
    location.href = location.href.substr(0, location.href.lastIndexOf("/") + 1) + "screenshotPage.html";
})




