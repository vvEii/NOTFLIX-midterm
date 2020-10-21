/* eslint-disable no-undef */
/* eslint-disable camelcase */
$(() => {
  $(".list-group").on("click", loadItemsByCategories);
});

const loadItemsByCategories = (e) => {
  const category = $(e.target).text();
  $.get(`/categories/${category}`).then(
    (res) => {
      const items = res.items;
      console.log(items);
    }
  ).catch(err => {
    console.log(err);
  });
};

