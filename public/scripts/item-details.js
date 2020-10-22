/* eslint-disable no-undef */

// create item reviews
const createReview = (item) => {
  const rating = Number.parseFloat(item.rating).toFixed(2);
  let $reviews = `
  <p><span class="fa fa-star checked"></span>${rating}/5</p>
  <h3>From ${item.name}</h3><p>${item.message}</p>
  `;
  return $reviews;
};

// create item details element
const createItemDetails = (items, favoriteItemIDs) => {
  const item = items[0];
  const itemID = item.id;
  const name = item.name;
  const price = "$" + item.price;
  let rating = Number.parseFloat(item.avg_rating).toFixed(2);
  const description = item.description;
  const stock = item.stock;
  //const is_sold = item.is_sold;
  const thumbnail = item.thumbnail_url;
  //const cover = item.cover_url;
  let $favoriteEle = "";
  // check if the current item is in current user's favorite list
  if (favoriteItemIDs.includes(itemID)) {
    $favoriteEle =
      '<div class="un-favorite"> <i class="fas fa-heart fa-2x"></i></div>';
  } else {
    $favoriteEle =
      '<div class="un-favorite" onClick="addFavorite()"><i class="far fa-heart fa-2x"></i></div>';
  }

  if (isNaN(rating)) {
    rating = "no ratings";
  } else {
    rating += "/5";
  }
  const $item = `
  <div class="wrapper">
  <div class="box-image">
    <img src=${thumbnail} alt='Image'>
  </div>
  <div class="box-info">
  <div class="box-name-heart">
    <h3 >${name}</h3>
    ${$favoriteEle}
  </div>
    <h5 class="currency">CDN ${price}</h5>
    <h5><span class="fa fa-star checked"></span> ${rating}</h5>
    <h5>Stocks: ${stock}</h5>
    <h5>Description:</h5>
    <p>${description} (movie ID: <span id="item-id">${itemID}</span>)</p>
  </div>
  <div class="box-reviews">
  </div>
  </div>
  `;
  return $item;
};

// render item reviews
const renderReviews = (itemArr) => {
  if (itemArr.length === 0) {
    const $noReviews = `<h5>No comments yet.</h5>`;
    $(".box-reviews").append($noReviews);
  } else {
    let $reviewTitle = "<h3>Reviews</h3>";
    $(".box-reviews").append($reviewTitle);
    itemArr.forEach((ele) => {
      const $itemReview = createReview(ele);
      $(".box-reviews").append($itemReview);
    });
  }
};

// load all item reviews from database
const loadReviews = (id) => {
  $.get(`api/items/reviews/${id}`)
    .then((res) => {
      renderReviews(res.item);
    })
    .catch((err) => console.log(err));
};

// load item details information from database
const loadDetails = (id) => {
  // --------------issue: removeEventListener is not a function, and how to remove anonymous function
  // const $image = $(`.item-img-${id}`);
  // const $name = $(`.item-name-${id}`);

  // $image.removeEventListener("click", loadDetails);
  // $name.removeEventListener("click", loadDetails);

  $.get("favorite/list")
    .then((res) => {
      const favoriteItemIDs = [];
      res.favoriteList.forEach((ele) => favoriteItemIDs.push(ele.item_id));
      return favoriteItemIDs;
    })
    .then((favoriteItemIDs) => {
      $.get(`/api/items/details/${id}`)
        .then((res) => {
          const $outterContainer = $(".outter-container");
          $outterContainer.hide();
          const $itemDetails = createItemDetails(res.item, favoriteItemIDs);
          $(".navbar").after($itemDetails);
          $('.btn-delete').show();
          loadReviews(id);
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};
