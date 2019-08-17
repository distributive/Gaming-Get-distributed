$(document).ready (function () {

  // Sign up button (Vive)
  var viveSignUpFunc = function () {
    if ($("#vive-name-input").val ().trim () != "")
    {
      enqueue ($("#vive-name-input").val ().trim ()); // TEMP //

      // Toggle visuals
      $("#vive-name-input").prop ("disabled", true);
      $("#button-vive-sign-up").text ("Leave Queue");
      $("#button-vive-sign-up").removeClass ("out-queue");
      $("#button-vive-sign-up").addClass ("in-queue");
      $("#button-vive-sign-up").removeClass ("button-blue");
      $("#button-vive-sign-up").addClass ("button-red");
      $("#vive-name-input").removeClass ("invalid");

      // Toggle function
      $("#button-vive-sign-up").off ();
      $("#button-vive-sign-up").click (viveLeaveFunc);

      // Disable button for cooldown
      $("#button-vive-sign-up").prop ("disabled", true);
      window.setTimeout (function () {
        $("#button-vive-sign-up").prop("disabled", false);
      }, 500);
    }
    else
    {
      $("#vive-name-input").addClass ("invalid");
    }
  };

  var viveLeaveFunc = function () {
    removeName ($("#vive-name-input").val ().trim ()); // TEMP //

    // Toggle visuals
    $("#vive-name-input").prop ("disabled", false);
    $("#button-vive-sign-up").text ("Sign Up");
    $("#button-vive-sign-up").removeClass ("in-queue");
    $("#button-vive-sign-up").addClass ("out-queue");
    $("#button-vive-sign-up").removeClass ("button-red");
    $("#button-vive-sign-up").addClass ("button-blue");

    // Toggle function
    $("#button-vive-sign-up").off ();
    $("#button-vive-sign-up").click (viveSignUpFunc);

    // Disable button for cooldown
    $("#button-vive-sign-up").prop ("disabled", true);
    window.setTimeout (function () {
      $("#button-vive-sign-up").prop("disabled", false);
    }, 500);
  };

  // Set up the initial function of the sign-up button
  $("#button-vive-sign-up.out-queue").click (viveSignUpFunc);
  $("#vive-name-input").change (viveSignUpFunc);

  setQueue (["Amelie", "Bamelie", "Camelie", "Damelie"]);
  dequeue ();
});



/* Queueing functions */
// For external use only - don't think playing with these will get you on the Vive any quicker
var queue = [];

// Empties the queue
function clearQueue ()
{
  queue = [];
  $("#vive-queue").empty ();
  $(".queue-ticket").text ();
}

// Clears the queue  and replaces it with the given list of names
// The first element represent the "current user" of the Vive
function setQueue (waitingList)
{
  clearQueue ();

  for (var i = 0; i < waitingList.length; i++)
    enqueue (waitingList[i]);
}

// Adds a name to the end of the queue
function enqueue (name)
{
  queue.push (name);
  if (queue.length == 1)
  {
    $("#currently-on-vive").text (name);
  }
  else if (queue.length == 2)
  {
    $("#next-on-vive").text (name);
  }
  else
  {
    $("#vive-queue").append (createQueueTicket (name));
  }
}

// Removes the "current user" and shifts the remaining queuers up
function dequeue ()
{
  queue.shift ();
  setQueue (queue);
}

// Removes the given name (if present) and readjusts the queue
function removeName (name)
{
  queue = queue.filter (entry => entry.trim () != name.trim ());
  setQueue (queue);
}

// Creates a queue ticket containing the given name
function createQueueTicket (name)
{
  return '<div class="queue-ticket">\n' + name + '\n</div>\n';
}
