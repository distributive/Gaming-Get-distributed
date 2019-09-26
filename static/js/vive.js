// For external use only - don't think playing with these will get you on the Vive any quicker
var queue = [];

String.prototype.isEmpty = function() {
    return (this.length === 0 || !this.trim());
};

$(document).ready(function() {

    // Sign up button (Vive)
    var viveSignUpFunc = function() {
        let name = $("#vive-name-input").val().trim();
        if (!name.isEmpty()) {
            queue.push(name);
            invalidateQueue();

            // Toggle visuals
            $("#vive-name-input").prop("disabled", true);
            $("#button-vive-sign-up").text("Leave Queue");
            $("#button-vive-sign-up").removeClass("out-queue");
            $("#button-vive-sign-up").addClass("in-queue");
            $("#button-vive-sign-up").removeClass("button-blue");
            $("#button-vive-sign-up").addClass("button-red");
            $("#vive-name-input").removeClass("invalid");

            // Toggle Vive sidebar button
            // TODO: Add place in queue
            // $("#button-vive").text("Waiting For The Vive ()");

            // Toggle function
            $("#button-vive-sign-up").off();
            $("#button-vive-sign-up").click(viveLeaveFunc);

            // Disable button for cooldown
            $("#button-vive-sign-up").prop("disabled", true);
            window.setTimeout(function() {
                $("#button-vive-sign-up").prop("disabled", false);
            }, 500);
        } else {
            $("#vive-name-input").addClass("invalid");
        }
    };

    var viveLeaveFunc = function() {
        let name = $("#vive-name-input").val().trim();
        removeName(name);

        // Toggle visuals
        $("#vive-name-input").prop("disabled", false);
        $("#button-vive-sign-up").text("Sign Up");
        $("#button-vive-sign-up").removeClass("in-queue");
        $("#button-vive-sign-up").addClass("out-queue");
        $("#button-vive-sign-up").removeClass("button-red");
        $("#button-vive-sign-up").addClass("button-blue");

        // Toggle Vive sidebar button
        // $("#button-vive").text("Sign Up For The Vive");

        // Toggle function
        $("#button-vive-sign-up").off();
        $("#button-vive-sign-up").click(viveSignUpFunc);

        // Disable button for cooldown
        $("#button-vive-sign-up").prop("disabled", true);
        window.setTimeout(function() {
            $("#button-vive-sign-up").prop("disabled", false);
        }, 500);

        invalidateQueue();
    };

    // Set up the initial function of the sign-up button
    $("#button-vive-sign-up.out-queue").click(viveSignUpFunc);
    $("#vive-name-input").change(viveSignUpFunc);
});

/* Queueing functions */
function invalidateQueue() {
    // Clear the queue DOM
    $("#vive-queue").empty();
    $(".queue-ticket").text("");
    // If there's nothing to re-render then just return
    if (queue.length === 0) return;

    // Add the first item to "currently on"
    $("#currently-on-vive").text(queue[0]);
    // Add any further items down the list
    if (queue.length >= 2) {
        $("#next-on-vive").text(queue[1]);

        // Add the rest of the names to the larger list
        for (var i = 2; i < queue.length - 1; i++) {
            $('#vive-queue').append('<div class="queue-ticket">' + queue[i] + '</div>');
        }
    }
}

// Removes the given name (if present) and readjusts the queue
function removeName(name) {
    queue = queue.filter(entry => entry.trim() !== name.trim());
    console.log(document.cookie);
}

// Test
queue.push('Foo');
invalidateQueue();