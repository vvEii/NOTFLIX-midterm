/* eslint-disable no-undef */
/* eslint-disable camelcase */
$(() => {
  $(".favorite-link").on("click", loadFavorite);
  // add listener is not working
  // $(".far.fa-heart.fa-2x").on("click", addFavorite);
  // this is not working too
  // $(".un-favorite").on("click",addFavorite);
});

// add the current item into current users favorite list
const addFavorite = function () {
  const $favoritedIcon = '<i class="fas fa-heart fa-2x"></i>';
  $(".un-favorite").empty();
  $(".un-favorite").append($favoritedIcon);

  const itemID = $("#item-id").text();
  $.post("favorite/add", { itemID })
    .then((res) => {
      // if the response has a new added row then add badge to remind user add favorite successfully
      if (res.favoriteItem) {
        const $badge = '<span class="badge badge-light">+1</span>';
        $(".favorite-link").append($badge);
      }
    })
    .catch((err) => console.log(err));
  // remove the badge
  setTimeout(() => {
    $(".badge.badge-light").remove();
  }, 1500);
};

// load all favorite items from database
const loadFavorite = () => {
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
