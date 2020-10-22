/* eslint-disable no-undef */
/* eslint-disable camelcase */
$(() => {
  $(".favorite-link").on("click", loadFavorite);
  // add listener is not working
  // $("far .fa-heart .fa-2x").on("click", addFavorite);
  // this is not working too
  // $(".un-favorite").on("click",addFavorite);
});

const addFavorite = function () {
  const $favoritedIcon = '<i class="fas fa-heart fa-2x"></i>';
  $(".un-favorite").empty();
  $(".un-favorite").append($favoritedIcon);

  const itemID = $("#item-id").text();
  $.post("favorite/add",{itemID})
    .then((res) => {

    })
    .catch((err) => console.log(err));
};

const loadFavorite = () => {
  console.log("click me");
  $.get("/favorite")
    .then((res) => {
      const allFavorites = res.items;
      const $itemListContainer = $(".item-list-container");
      $itemListContainer.empty();
      if (allFavorites.length === 0) {
        renderEmptyFavorite();
        renderItemAmount(0);
      } else {
        renderItems(allFavorites);
        renderItemAmount(allFavorites.length);
      }
    })
    .catch((err) => console.log(err));
};

// create element when there is none favorite movies
const createEmptyFavorite = () => {
  const $h4 = `<h4>You have not added any favorite movies.</h4>`;
  return $h4;
};

// render element when there is none favorite movies
const renderEmptyFavorite = () => {
  const $h4 = createEmptyFavorite();
  $(".item-list-container").append($h4);
};
