$(document).ready(function() {
	
	var states = ['closed', 'small', 'medium', 'big'];
	var zones = ['orange', 'red', 'blue', 'green'];
	
	$(".square").on("click", function(){
		for(i = 0; i < zones.length; i++){
			if($(this).hasClass(zones[i]))
				break;
		};
		var zone = $(".zone." + zones[i]);
		var zone2 = $(".zone." + zones[(i+1) % zones.length]);
		var axe = i % 2;
		for(i = 0; i < states.length; i++){
			if(zone.hasClass(states[i]))
				break;
		};
		zone.removeClass(states[i]);
		zone.addClass(states[(i+1) % states.length]);
		if(axe == 0)
			zone2.height($("body").height() - zone.height());
		else
			zone2.width($("body").width() - zone.width());
//		$(".calendar").width($("body").width() - $(".zone.red").width() - $(".zone.green").width());
//		$(".calendar").height($("body").height() - $(".zone.red").height() - $(".zone.green").height());
	});

  
  var calendar = [], oldCalendar = [];
  var isSelecting   = false;

  // Filling a empty calendar
  for (day = 0; day < 7; day++) {
    calendar[day] = [];
    for (period = 0; period < 48; period++) {
      calendar[day][period] = "empty";
    }
  }

  // Filling the DOM
  function MakeCalendar() {
    $(".calendar").empty();
    for (day = 0; day < 7; day++) {
      var column = $("<div class='column'></div>");

      for (period = 0; period < 48; period++) {
        var line = $("<div class='line "+calendar[day][period]+"' data-i='"+day+"' data-j='"+period+"'></div>");
        column.append(line);
      }

      $(".calendar").append(column);
    }
  }

  MakeCalendar();

  var calendar = [], oldCalendar = [];
  var selectionMode = false;
  var selectI, selectJ;

  function BindEvents() {
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

      if (isSelecting == false)
        return ;

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
            // Updating calendar
            calendar[a][b] = mode;

            // Updating DOM if necessary
            el = $(".line[data-i="+a+"][data-j="+b+"]")
            el.removeClass("free empty first last").text("");
            el.addClass(mode)
          }
        }
      }
      // --- First and last

      // time function
       function getTimeFromPeriod(n) {
         return Math.floor(n / 2) + ":" + (n % 2 ? "00" : "30");
       }

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
  BindEvents();
});
