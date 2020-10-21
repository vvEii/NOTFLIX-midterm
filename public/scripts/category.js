/* eslint-disable no-undef */
/* eslint-disable camelcase */
$(() => {
  $(".list-group").on("click", loadItemsByCategories);
  // removeEventListener is not a function
  //$('.list-group').removeEventListener('click',loadItemsByCategories);
});

// load all items from the category that user clicked
const loadItemsByCategories = (e) => {
  $(e.target).addClass("actived").siblings().removeClass("actived");
  const category = $(e.target).text();
  if (category === "All Movies") {
    loadItems();
  } else {
    const $itemListContainer = $(".item-list-container");
    $itemListContainer.empty();
    $.get(`/categories/${category}`)
      .then((res) => {
        const allitems = res.items;
        const amount = allitems.length;
        renderItemAmount(amount);
        renderItems(allitems);
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
