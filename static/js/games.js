$(document).ready (function () {

  $(".game-button.uninstalled").click (function () {
      requestInstallation ($(this));
  });
});



/*
WAS TEMP, now made whole
*/
function requestInstallation (button)
{
  // Set button to loading
  button.off ();
  button.prop ("disabled", true);
  button.css ("background-image", "linear-gradient(to right, var(--button_blue), var(--button_blue) 0, transparent 0, transparent), url('static/img/hash.png')");
  button.css ("background-size", "100%, 16px");
  button.css ("background-position", "right");
  button.css ("background-color", "var(--warwickgg_dark_grey)");
  button.text ("");

  console.log(button);
  const game = button[0].value;
  $.ajax({
    url: `install/${game}`,
    dataType: "text"
  })
  .done(data => {
    console.log(`started installing: ${game}`);
    updateProgress();
  });

  // Animate the loading bar
  function updateProgress() {
    $.ajax({
      url: `status/${game}`,
      dataType: "json"
    })
    .done(data => {
      if(data.progress === 1) {
          // Set the button to play
          button.prop ("disabled", false);
          button.addClass ("installed");
          button.removeClass("uninstalled");
          button.append ('<img src="static/img/play.png" class="play-symbol" draggable=false />');
          button.removeAttr ("style");
          $(".game-button.installed").click (function () {
              requestLaunch($(this));
          });
      }
      else {
        const percentage = data.progress * 100;
        button.css ("background-image", "linear-gradient(to right, var(--button_blue), var(--button_blue) " + percentage + "%, transparent " + percentage + "%, transparent), url('static/img/hash.png')");
        setTimeout(function(){
          updateProgress();
        },100);
      }
    });
  }
}

function requestLaunch(button)
{
  console.log(button);
  const game = button[0].value;
  $.ajax({
    url:`launch/${game}`,
    dataType: "text"
  })
  .done(data => {
    console.log(`attempting to launch: ${game}`);
  });
}
