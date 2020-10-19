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
        loadItemsFromLowToHign();
        break;
      case "highToLow":
        loadItemsFromHighToLow();
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
  const picture = item.picture;
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
  const sortedItems = items.filter((ele) => ele.category === "featured");
  const amount = sortedItems.length;
  const $itemListContainer = $(".item-list-container");

  $itemListContainer.empty();
  renderItems(sortedItems);
  renderItemAmount(amount);
};

// load all items price low to high
const loadItemsFromLowToHign = (data) => {
  const items = data.slice();
  const $itemListContainer = $(".item-list-container");
  $itemListContainer.empty();
  items.sort((a, b) => a.price - b.price);
  loadItems(items);
};

// load all items from price high to low
const loadItemsFromHighToLow = (data) => {
  const items = data.slice();
  const $itemListContainer = $(".item-list-container");
  $itemListContainer.empty();
  items.sort((a, b) => b.price - a.price);
  loadItems(items);
};

//temp data
const items = [
  {
    id: 1,
    owner_id: 1,
    name: "laptop",
    price: 299.0,
    category: "featured",
    description:
      "Suspendsse rutrum vestibulum nibh, Donec posuere lobortis ex, id luctus orci. Vestibulum auctor nisl urna, id elementum libero malesuada vitae. Integer id nibh hendrerit, tristique turpis ac, tempor eros",
    picture:
      "https://m.media-amazon.com/images/I/81lfR4FnRhL._AC_UL640_FMwebp_QL65_.jpg",
    stock: 10,
    is_sold: false,
  },
  {
    id: 2,
    owner_id: 2,
    name: "laptop",
    price: 730.0,
    category: "featured",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. por eros",
    picture:
      "https://m.media-amazon.com/images/I/71mimPP+H8L._AC_UL640_FMwebp_QL65_.jpg",
    stock: 10,
    is_sold: false,
  },
  {
    id: 3,
    owner_id: 3,
    name: "laptop",
    price: 300.0,
    category: "SUV",
    description: "Lorem ipsum dolor sit amet,  eros",
    picture:
      "https://m.media-amazon.com/images/I/81G-GxbJrNL._AC_UL640_FMwebp_QL65_.jpg",
    stock: 10,
    is_sold: false,
  },
  {
    id: 4,
    owner_id: 4,
    name: "laptop",
    price: 1099.0,
    category: "SUV",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscibh,tum urna. Orci varius natoque penatibus et magnis dis onec posuere lobortis ex, id luctus orci. Vestibulum auctor nisl urna, id elementum libero malesuada vitae. tristique turpis ac, tempor eros",
    picture:
      "https://m.media-amazon.com/images/I/81fstJkUlaL._AC_UL640_FMwebp_QL65_.jpg",
    stock: 10,
    is_sold: false,
  },
  {
    id: 5,
    owner_id: 5,
    name: "laptop",
    price: 298.0,
    category: "sedan",
    description:
      "Lorem ipsum dolor sit amet, consectetur dignissim ut est. Suspendisse rutrum vestibulum nibh, Vestibulum auctor nisl urna, id elementum libero malesuada vitae. Integer id nibh hendrerit, tristique turpis ac, tempor eros",
    picture:
      "https://m.media-amazon.com/images/I/91pFQm4adhL._AC_UL640_FMwebp_QL65_.jpg",
    stock: 10,
    is_sold: false,
  },
];
