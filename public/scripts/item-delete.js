/* eslint-disable no-undef */
$(() => {
  $(".btn-delete").on("click", deleteItem);
});

const deleteItem = () => {
  const itemID = $("#item-id").text();
  $.post(`/delete/${itemID}`)
    .then(() => {
      // temporarilly
      location.reload();
    })
    .catch((err) => console.log(err));
};
