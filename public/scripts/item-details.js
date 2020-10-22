/* eslint-disable no-undef */
$(() => {
  // again this won't work
  //$(".btn-add-review").on("click", showNewReview);
  //$(".btn-submit-review").click(addReview);
});

const addReview = () => {
  const rating = $("#new-review-rating").val();
  const message = $("#review-text").val();
  const itemID = $("#item-id").text();

  const review = {
    rating,
    message,
    itemID,
  };
  $.post("/review/add", review)
    .then((res) => {
      if (res) {
        //$('.box-reviews').empty();
        //loadReviews(itemID);
      } else {
        console.log("add review failed");
      }
    })
    .catch((err) => console.log(err));
};

const showNewReview = () => {
  const $newReviewContainer = $(".new-review-container");
  if ($newReviewContainer.css("display") === "none") {
    $newReviewContainer.slideDown("slow");
    const $textArea = $("#review-text");
    $textArea.focus();
  } else {
    $newReviewContainer.slideUp("slow");
  }
};

// create item reviews
const createReview = (item) => {
  const rating = Number.parseFloat(item.rating).toFixed(2);
  let $reviews = `
  <div class="review">
  <h5>From <span class="user-name">${item.name}</span></h5>
  <h5><span class="fa fa-star checked"></span>${rating}/5</h5>
  </div>
  <p>${item.message}</p>
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
  <div class="box-price-rating">
    <h5 class="currency">CDN ${price}</h5>
    <h5><span class="fa fa-star checked"></span> ${rating}</h5>
    </div>
    <h5>Stocks: ${stock}</h5>
    <h5>Description:</h5>
    <p>${description} (movie ID: <span id="item-id">${itemID}</span>)</p>
    <button class="btn-add-cart">Add to Cart   <i class="fas fa-shopping-cart"></i></button>
  </div>
  <div class="box-reviews">
  </div>
  </div>
  `;
  return $item;
};

// render item reviews
const renderReviews = (itemArr) => {
  let $reviewTitle = `
  <div class="review-title-container">
    <span class="review-title">Reviews</span>
    <button class="btn-add-review" onClick="showNewReview()">Add Reviews</button>
  </div>
  <div class="new-review-container">
  <div class="flex-container">
    <textarea name="text" id="review-text"></textarea>
    <div class="rating-container">
    <h5>Rating(range from 0 to 5, integer only)</h5>
    <input type="text" id="new-review-rating"></input>
    </div>
    <button class="btn-submit-review" onclick="addReview()">add</button>
    </div>
  </div>
  `;
  $(".box-reviews").append($reviewTitle);
  if (itemArr.length === 0) {
    const $noReviews = `<h5>No comments yet.</h5>`;
    $(".box-reviews").append($noReviews);
  } else {
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
      res.item.reverse();
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
          $("nav").after($itemDetails);
          $(".btn-delete").show();
          loadReviews(id);
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};
