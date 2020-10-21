/* eslint-disable no-undef */
/* eslint-disable camelcase */
$(() => {
  $(".list-group").on("click", loadItemsByCategories);
});

const loadItemsByCategories = (e) => {
  const category = $(e.target).text();
  console.log(category);
};
