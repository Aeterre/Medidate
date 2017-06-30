// Calendar state
var calendar = [], oldCalendar = [];
var selectI, selectJ;
var isSelecting   = false;
var selectionMode = null;

// Filling a empty calendar
for (var day = 0; day < 7; day++) {
  calendar[day] = [];
  for (var period = 0; period < 48; period++) {
    calendar[day][period] = "empty";
  }
}

// Format the date based on the item index
function getTimeFromPeriod(n) {
  return Math.floor(n / 2) + ":" + (n % 2 ? "00" : "30");
}


/*
 * MakeCalendar()
 * Filling the DOM with the calendar using the values of calendar[]
 */
function makeCalendar() {
  $(".calendar").empty();
  for (day = 0; day < 7; day++) {
    var column = $("<div class='column'></div>");
    for (period = 0; period < 48; period++) {
      var line = $("<div class='line "+ calendar[day][period] +"' data-i='"+ day +"' data-j='"+ period +"'></div>");
      column.append(line);
    }
    $(".calendar").append(column);
  }
}


/*
 * BindCalendarEvents()
 * Bind mousedown/mouseup/mouseover for the calendar logic
 */
function bindCalendarEvents() {

  $(".line").on("mousedown", function() {

    selectI = $(this).data('i');
    selectJ = $(this).data('j');

    isSelecting = true;

    if (calendar[selectI][selectJ] == "empty") {
      selectionMode = 'free';
    } else {
      selectionMode = 'empty';
    }

    if ($(this).hasClass('empty')) {
      calendar[selectI][selectJ] = "free";
      $(this).removeClass('empty').addClass('free');
    } else {
      calendar[selectI][selectJ] = "empty";
      $(this).removeClass('free').addClass('empty');
    }

    oldCalendar = [];
    for (a = 0; a < 7; a++) {
      oldCalendar[a] = [];
      for (b = 0; b < 48; b++) {
        oldCalendar[a][b] = calendar[a][b];
      }
    }

  });

  $(window).on('mouseup',  function() {
    isSelecting = false;
  });


  $(".line").on("mouseover", function() {

    // Return unless we're selecting
    if (isSelecting == false) {
      return ;
    }

    // --- Refreshing free or empty

    var i = $(this).data('i');
    var j = $(this).data('j');

    for (a = 0; a < 7; a++) {
      for (b = 0; b < 48; b++) {

        var mode = null;

        // Rectangle de selection
        if ((a >= i && a <= selectI || a >= selectI && a <= i) && (b >= j && b <= selectJ || b >= selectJ && b <= j)) {
          mode = selectionMode;
        } else {
          mode = oldCalendar[a][b];
        }

        if (mode != calendar[a][b]) {
          // Updating calendar and DOM if necessary
          calendar[a][b] = mode;

          el = $(".line[data-i="+a+"][data-j="+b+"]")
          el.removeClass("free empty first last").text("");
          el.addClass(mode)
        }
      }
    }

    // --- First and last

    // Clean all lasts first and lasts
    $(".first").removeClass("first").text("");
    $(".last").removeClass("last").text("");

    // Scan calendar and update firsts and lasts
    for (a = 0; a < 7; a++) {
      var lastIsSelected = false;
      for (b = 0; b < 48; b++) {
        if (calendar[a][b] == "free" && lastIsSelected == false) {
          $(".line[data-i="+a+"][data-j="+b+"]").addClass("first").text(getTimeFromPeriod(b));
          lastIsSelected = true;
        }

        if (calendar[a][b] == "empty" && lastIsSelected == true) {
          $(".line[data-i="+a+"][data-j="+(b-1)+"]").addClass("last" ).text(getTimeFromPeriod(b));
          lastIsSelected = false;
        }
      }
    }
  });
};


$(document).ready(function() {
  makeCalendar();
  bindCalendarEvents();
});

