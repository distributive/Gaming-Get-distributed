$(document).ready (function () {

  // Immediately hide all pop-ups
  $(".pop-up-background").hide (100);
  $(".pop-up-window").hide (200);

  // Function for closing the current pop-up
  function closePopUps () {
    $(".pop-up-background").fadeOut (100);
    $(".pop-up-window").fadeOut (200);
  };



  /* Button events */
  $("#button-steam").click (function () {
    alert ("Steam");
  });

  $("#button-chrome").click (function () {
    window.open ("https://google.com", "window name", "window settings");
  });

  $("#button-volume").click (function () {
    alert ("Volume");
  });

  $("#button-mouse").click (function () {
    alert ("Mouse");
  });

  $("#button-resolution").click (function () {
    alert ("Resolution");
  });

  $("#button-food").click (function () {
    $(".pop-up-background").fadeIn (100);
    $("#food-redirect").fadeIn (200);
  });
  $("#button-discord").click (function () {
    window.open ("https://discord.gg/uwcs", "window name", "window settings");
    window.setTimeout (closePopUps, 500);
  });

  $("#button-vive").click (function () {
    $(".pop-up-background").fadeIn (100);
    $("#vive-list").fadeIn (200);
  });



  // Pop-up windows
  $(".pop-up-window").on ("click", function (e) {
    e.stopPropagation();
  });

  $(".close-pop-up").click (closePopUps);
  /* Button events END */

});
