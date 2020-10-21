// Open and Closes Chat functionality
const openChat = document.querySelector('.open-button');
const controlForm = document.querySelector('.chat-popup');
const closeChat = document.querySelector(".cancel");

// Opens Chat
openChat.addEventListener('click', function(){
  controlForm.style.display = "block";
});

// Closes Chat
closeChat.addEventListener('click', function() {
  controlForm.style.display = "none";
});

// Template code from FormSpree - sends user message to admin
window.addEventListener("DOMContentLoaded", function() {
  // get the form elements defined in your form HTML above
  var form = document.getElementById("my-form");
  var status = document.getElementById("form-status");

  // Success and Error functions for after the form is submitted
  function success() {
    form.reset();
    status.innerHTML = "Message Successfully Sent!";
    status.classList.add("success");

    setTimeout(function(){
      status.innerHTML = "";
      status.classList.remove("mystyle");
    }, 2000)
  }

  function error() {
    status.innerHTML = "Oops! There was a problem.";
    status.classList.add("error");
  }

  // handle the form submission event
  form.addEventListener("submit", function(ev) {
    ev.preventDefault();
    var data = new FormData(form);
    ajax(form.method, form.action, data, success, error);
  });
});

// helper function for sending an AJAX request

function ajax(method, url, data, success, error) {
  var xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.setRequestHeader("Accept", "application/json");
  xhr.onreadystatechange = function() {
    if (xhr.readyState !== XMLHttpRequest.DONE) return;
    if (xhr.status === 200) {
      success(xhr.response, xhr.responseType);
    } else {
      error(xhr.status, xhr.response, xhr.responseType);
    }
  };
  xhr.send(data);
}