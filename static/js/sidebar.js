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



  // Sign up button (Vive)
  var viveSignUpFunc = function () {
    if ($("#vive-name-input").val ().trim () != "")
    {
      // Toggle visuals
      $("#vive-name-input").prop ("disabled", true);
      $("#button-vive-sign-up").text ("Leave Queue");
      $("#button-vive-sign-up").removeClass ("out-queue");
      $("#button-vive-sign-up").addClass ("in-queue");
      $("#button-vive-sign-up").removeClass ("button-blue");
      $("#button-vive-sign-up").addClass ("button-red");
      $("#vive-name-input").removeClass ("invalid");

      // Toggle function
      $("#button-vive-sign-up").click (viveLeaveFunc);

      // Disable button for cooldown
      $("#button-vive-sign-up").prop ("disabled", true);
      window.setTimeout (function () {
        $("#button-vive-sign-up").prop("disabled", false);
      }, 1000);
    }
    else
    {
      $("#vive-name-input").addClass ("invalid");
    }
  };

  var viveLeaveFunc = function () {
    // Toggle visuals
    $("#vive-name-input").prop ("disabled", false);
    $("#button-vive-sign-up").text ("Sign Up");
    $("#button-vive-sign-up").removeClass ("in-queue");
    $("#button-vive-sign-up").addClass ("out-queue");
    $("#button-vive-sign-up").removeClass ("button-red");
    $("#button-vive-sign-up").addClass ("button-blue");

    // Toggle function
    $("#button-vive-sign-up").click (viveSignUpFunc);

    // Disable button for cooldown
    $("#button-vive-sign-up").prop ("disabled", true);
    window.setTimeout (function () {
      $("#button-vive-sign-up").prop("disabled", false);
    }, 1000);
  };

  $("#button-vive-sign-up.out-queue").click (viveSignUpFunc);
  $("#vive-name-input").change (viveSignUpFunc);



  // Pop-up windows
  $(".pop-up-window").on ("click", function (e) {
    e.stopPropagation();
  });

  $(".close-pop-up").click (closePopUps);
  /* Button events END */

});
