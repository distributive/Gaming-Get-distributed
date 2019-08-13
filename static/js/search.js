
$(document).ready (function () {

  $("#search-bar").on ("input", function () {
    var search = $("#search-bar").val ().toLowerCase ().split (",");
    search = search.filter (function (e) {return e;});
    search = search.map (e => e.toString ().replace (/\s+/g, ' '));
    var games = $(".game-ticket");

    games.each (function (index, element) {
      if (search.length != 0)
      {
        var matches = 0;

        // Check for matching name
        var name = $(element).find ("h3").text ().toLowerCase ();
        for (var i = 0; i < search.length; i++)
        {
          if (search[i].trim () && name.includes (search[i].trim ()))
          {
            matches++;
          }
        }

        // Check for matching tags
        var tags = $(element).find (".game-ticket-tag");
        tags.each (function (i, e) {
          for (var i = 0; i < search.length; i++)
          {
            if (search[i].trim () && $(e).text ().toLowerCase ().includes (search[0].trim ()))
            {
              matches++;
            }
          }
        });

        if (matches > 0)
          $(element).show (100);
        else
          $(element).hide (150);
      }
      else
      {
        $(element).show (100);
      }
    });

    /*// Sort games based on relevance
    games.sort (function (a, b) {
      return a.val () - b.val ();
    });*/
  });

});
