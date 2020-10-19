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
// create item elements
const createItem = (item) => {
  const name = item.name;
  const price = "$" + item.price;
  const description = item.description;
  const picture = item.cover_url;
  //const stock = item.stock;
  //const is_sold = item.is_sold;
  const $item = `
    <div class="col mb-4">
    <div class="card h-100">
      <img src=${picture} class="card-img-top" alt="I am a picture">
      <div class="card-body">
        <h5 class="card-title">${name}</h5>
        <p> ${price}</p>
      </div>
    </div>
  </div>
    `;
  return $item;
};

// render items that passed in
const renderItems = (itemArr) => {
  console.log(itemArr);
  itemArr.forEach((ele) => {
    let $item = createItem(ele);
    $(".item-list-container").append($item);
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
