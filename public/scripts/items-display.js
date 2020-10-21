/* eslint-disable no-undef */
/* eslint-disable camelcase */
$(() => {
  //load all items from database
  loadItems();

  $("#filter").on("change", (e) => {
    const option = e.target.value;
    switch (option) {
      case "all":
        //should call loadItem() after switch to real database
        loadItems();
        break;
      case "lowToHigh":
        loadItemsBasedOnPrice("/api/items/price-low-to-high");
        break;
      case "highToLow":
        loadItemsBasedOnPrice("/api/items/price-high-to-low");
        break;
      case "featured":
        loadFeaturedItems();
        break;
    }
  });
});

// create item reviews
const createReview = (item) => {
  let $reviews = `<h3>From user ${item.name}</h3><p>${item.message}</p>`;
  return $reviews;
};

// create item details element
const createItemDetails = (items) => {
  const item = items[0];
  const name = item.name;
  const price = "$" + item.price;
  const rating = Number.parseFloat(item.avg_rating).toFixed(2);
  const description = item.description;
  const stock = item.stock;
  const is_sold = item.is_sold;
  const thumbnail = item.thumbnail_url;
  //const cover = item.cover_url;

  const $item = `
  <div class="wrapper">
  <div class="box-image">
    <img src=${thumbnail} alt='Image'>
  </div>
  <div class="box-info">
    <h3>${name}</h3>
    <h5 class="currency">CDN ${price}</h5>
    <h5><span class="fa fa-star checked"></span> ${rating}/ 5</h5>
    <h5>Stocks: ${stock}</h5>
    <h5>Description:</h5>
    <p>${description}</p>
  </div>
  <div class="box-reviews">
  </div>
  </div>
  `;
  return $item;
};

// create item elements
const createItem = (item) => {
  const id = item.id;
  const name = item.name;
  const price = "$" + item.price;
  const rating = Number.parseFloat(item.avg_rating).toFixed(2);
  const thumbnail = item.thumbnail_url;

  // <p> <span class="fa fa-star checked"></span> ${rating}/ 5</p>
  const $item = `
    <div class="col mb-4">
    <div class="card h-100">
      <img src=${thumbnail} class="card-img-top item-img-${id}" alt="Image">
      <div class="card-body">
        <h5 class="card-title item-name-${id}">${name}</h5>
        <p> ${price}</p>
      </div>
    </div>
  </div>
    `;
  return $item;
};

// add listener to item name and image
const addListener = (id) => {
  const $image = $(`.item-img-${id}`);
  const $name = $(`.item-name-${id}`);

  // use closure to pass the function with parameter "id"
  $image.on("click", (e) => {
    return loadDetails(id);
  });
  $name.on("click", () => {
    return loadDetails(id);
  });
};

// render item reviews
const renderReviews = (itemArr) => {
  itemArr.forEach((ele) => {
    let $itemReview = createReview(ele);
    $(".box-reviews").append($itemReview);
  });
};

// render items that passed in
const renderItems = (itemArr) => {
  itemArr.forEach((ele) => {
    let $item = createItem(ele);
    $(".item-list-container").append($item);
    addListener(ele.id);
  });
};

const renderItemAmount = (amount) => {
  const $itemAmount = $(".item-amount");
  $itemAmount.text(`Showing ${amount} items`);
};

// load all item reviews
const loadReviews = (id) => {
  $.get(`api/items/reviews/${id}`)
    .then((res) => {
      renderReviews(res.item);
    })
    .catch((err) => console.log(err));
};

// load item details information
const loadDetails = (id) => {
  $.get(`/api/items/details/${id}`)
    .then((res) => {
      const $outterContainer = $(".outter-container");
      $outterContainer.hide();
      const $itemDetails = createItemDetails(res.item);
      $("header").after($itemDetails);
      loadReviews(id);
    })
    .catch((err) => console.log(err));
};

// load all items from database
const loadItems = () => {
  const $itemListContainer = $(".item-list-container");
  $itemListContainer.empty();

  $.get("/api/items/all")
    .then((res) => {
      const allitems = res.items;
      const amount = allitems.length;
      renderItemAmount(amount);
      renderItems(allitems);
    })
    .catch((err) => console.log(err));
};

// load all Featured items from database
const loadFeaturedItems = () => {
  const $itemListContainer = $(".item-list-container");
  $itemListContainer.empty();

  $.get("/api/items/featured")
    .then((res) => {
      const featuredItem = res.items;
      const amount = featuredItem.length;
      renderItems(featuredItem);
      renderItemAmount(amount);
    })
    .catch((err) => console.log(err));
};

// load all items price low to high OR high to low based on the parameter
const loadItemsBasedOnPrice = (url) => {
  const $itemListContainer = $(".item-list-container");
  $itemListContainer.empty();

  $.get(url)
    .then((res) => {
      const sortedItems = res.items;
      const amount = sortedItems.length;
      renderItems(sortedItems);
      renderItemAmount(amount);
    })
    .catch((err) => console.log(err));
};
