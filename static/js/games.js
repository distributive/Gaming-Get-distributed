$(document).ready (function () {

  $(".game-button.uninstalled").click (function () {
    simulateInstallation ($(this));
  });

});



/* TEMP */
function simulateInstallation (button)
{
  // Set button to loading
  button.off ();
  button.prop ("disabled", true);
  button.css ("background-image", "linear-gradient(to right, var(--button_blue), var(--button_blue) 0, transparent 0, transparent), url('static/img/hash.png')");
  button.css ("background-size", "100%, 16px");
  button.css ("background-position", "right");
  button.css ("background-color", "var(--warwickgg_dark_grey)");
  button.text ("");

  // Animate the loading bar
  var i = 0;
  var interval = setInterval (function () {
    button.css ("background-image", "linear-gradient(to right, var(--button_blue), var(--button_blue) " + i + "%, transparent " + i + "%, transparent), url('static/img/hash.png')");
    if (i >= 100)
    {
      // Set the button to play
      button.prop ("disabled", false);
      button.addClass ("installed")
      button.css ("background-image", "var(--button_blue)");
      button.append ('<img src="static/img/play.png" class="play-symbol" draggable=false />');
      button.css ("background-color", "var(--button_blue)");
      clearInterval (interval);
    }
    i++;
  }, 10);
}
