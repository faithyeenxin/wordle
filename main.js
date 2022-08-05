import $ from "jquery";

console.log($);

const $modal = $(".modal");
const $startBtn = $(".modal_button");

window.onload = (event) => {
  setTimeout(() => {
    $modal.addClass("modal_visible");
  }, 1000);
};

$startBtn.on("click", () => {
  $modal.removeClass("modal_visible");
});
