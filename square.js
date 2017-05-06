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
});
