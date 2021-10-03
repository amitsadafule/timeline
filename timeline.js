//var timeline_data = JSON.parse(data);

console.log(timeline);

function format(source, params) {
	for(var i = 0; i < params.length; i++) {
		source = source.replace(new RegExp("\\{" + i + "\\}", "g"), params[i]);
	}
        
    return source;
}


var event = `<div class="{3}">
					{0}<br>{1}
				</div>
				<div class="{2}" id="{4}"></div>`

var event_direction = `<div class="item {0}" id="{2}">{1}</div>`
var year_events = `<div class="year" id="{2}"><div class="time" id="{3}"><div class="text-inner">{1}</div></div>{0}</div>`
//var time = `<div class="time" style="width: {1}px">{0}</div>`
var event_group = `<div class="items">{0}</div>`

var total_width = 0;


addEventListener("load", function () {
	//prepare_time_line();
	
	
});

function prepare_time_line() {
	for(var counter = 0; counter < timeline.length; counter++) {
		const year_data = timeline[counter];
		const year_div_id = "year-"+counter
		const time_div_id = "time-"+counter
		console.log(year_data, year_div_id, time_div_id); 
		document.getElementById("timeline").innerHTML += fill_year_data(year_data, year_div_id, time_div_id);
	}
	adjust_widths();
}

function adjust_widths() {
	
	setTimeout(function() {
		for(var counter = 0; counter < timeline.length; counter++) {
			const year_data = timeline[counter];
			const year_div_id = "year-"+counter
			const time_div_id = "time-"+counter
			set_time_bar_width(year_div_id, time_div_id);
			const style = window.getComputedStyle(document.getElementById(year_div_id));
			console.log(style.height, style.width);
	        total_width += parseInt(style.width.replace('px',''), 10) + 25;
	        console.log(total_width);
	        document.getElementById(time_div_id).style.width = style.width;
	        document.getElementById("timeline").style.width = total_width + "px";

	        
			for(var event_counter = 0; event_counter < year_data["events"].length; event_counter++) {
				var time = document.getElementById(time_div_id);
				var time_box = time.getBoundingClientRect();
				const line_div_id = year_div_id + "-line-" + event_counter;
				const item_div_id = year_div_id + "-item-" + event_counter;
				set_item_line_height(event_counter, year_div_id, time_div_id)
				var line = document.getElementById(line_div_id);
				var item = document.getElementById(item_div_id);
				
				if(item.className.includes("item-up")) {
					console.log(line_div_id, item_div_id, time_box.y, item.getBoundingClientRect().y, item.getBoundingClientRect().height);
					line.style.height = (time_box.y - (item.getBoundingClientRect().y + item.getBoundingClientRect().height)) + "px";
				}
			}
	        //line.style.height = (time_box.y - (item.getBoundingClientRect().y + item.getBoundingClientRect().height)) + "px";
		}
	}, 100);
}

function set_time_bar_width(year_div_id, time_div_id) {
    setTimeout(function() {

        const style = window.getComputedStyle(document.getElementById(year_div_id));
        console.log("before", style.height, style.width);
        if (style.height == 'auto' || style.width == 'auto') {
            set_time_bar_width();
        }
        // IF we got here we can do actual business logic staff
        console.log(style.height, style.width);
        total_width += parseInt(style.width.replace('px',''), 10) + 25;
        console.log(total_width);
        document.getElementById(time_div_id).style.width = style.width;
        document.getElementById("timeline").style.width = total_width + "px";
    }, 100);
};

function set_item_line_height(event_counter, year_div_id, time_div_id) {
    setTimeout(function() {

		var time = document.getElementById(time_div_id);
		var time_box = time.getBoundingClientRect();
		const line_div_id = year_div_id + "-line-" + event_counter;
		const item_div_id = year_div_id + "-item-" + event_counter;
		var line = document.getElementById(line_div_id);
		var item = document.getElementById(item_div_id);
		
		if(item.className.includes("item-up")) {
			console.log(line_div_id, item_div_id, time_box.y, item.getBoundingClientRect().y, item.getBoundingClientRect().height);
			line.style.height = (time_box.y - (item.getBoundingClientRect().y + item.getBoundingClientRect().height)) + "px";
		}
    }, 100);
};

function fill_year_data(year_data, year_div_id, time_div_id) {
	return format(year_events, [fill_events_data(year_data["events"], year_div_id), year_data["year"], year_div_id, time_div_id])
}

function fill_events_data(events_data, year_div_id) {
	var items_html = "";
	var isUp = true;
	for(var counter = 0; counter < events_data.length; counter++) {
		event_data = events_data[counter];
		const line_div_id = year_div_id + "-line-"+counter;
		const item_div_id = year_div_id + "-item-"+counter;
		items_html += fill_event_direction(event_data, isUp, line_div_id, item_div_id);
		isUp = !isUp;
	}
	return format(event_group, [items_html]);
}

function fill_event_direction(event_data, isUp, line_div_id, item_div_id) {
	if(isUp) return format(event_direction, ["item-up", fill_event_data(event_data, "line", line_div_id), item_div_id]);
	return format(event_direction, ["item-bottom", fill_event_data(event_data, "line-bottom", line_div_id), item_div_id]);
}

function fill_event_data(event_data, line_direction, line_div_id) {
	var description_css = "description";
	var line_css = line_direction;

	if(event_data["type"] == "IMP") {
		description_css = "description imp-event-description";
		line_css = line_direction + " imp-event-" + line_direction;
	}

	return format(event, [event_data["description"], event_data["date"] == null ? "" : "(" + event_data["date"] + ")", line_css, description_css, line_div_id]);
}