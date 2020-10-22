/* eslint-disable no-undef */
/* eslint-disable camelcase */
$(() => {
  //load all items from database
  loadItems();

  $("#filter").on("change", (e) => {
    const option = e.target.value;
    switch (option) {
    case "all":
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

// create item elements
const createItem = (item) => {
  const id = item.id;
  const name = item.name;
  const price = "$" + item.price;
  let rating = Number.parseFloat(item.avg_rating).toFixed(2);
  const thumbnail = item.thumbnail_url;

  if (isNaN(rating)) {
    rating = "no ratings";
  } else {
    rating += "/5";
  }

  const $item = `
    <div class="col mb-4">
    <div class="card h-100">
      <img src=${thumbnail} class="card-img-top item-img-${id}" alt="Image">
      <div class="card-body">
        <h5 class="card-title item-name-${id}">${name}</h5>
        <p> ${price}</p>
        <p> <span class="fa fa-star checked"></span> ${rating}</p>
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
  $image.on("click", () => {
    return loadDetails(id);
  });
  $name.on("click", () => {
    return loadDetails(id);
  });
};


// render items
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
