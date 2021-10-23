console.log(timeline);

function format(source, params) {
	for(var i = 0; i < params.length; i++) {
		source = source.replace(new RegExp("\\{" + i + "\\}", "g"), params[i]);
	}
        
    return source;
}

const orientation = {
	"UP":{
		"item_direction": "item-up",
		"line_direction": "line-up"
	},
	"DOWN":{
		"item_direction": "item-bottom",
		"line_direction": "line-bottom"
	}
};


var event = `<div class="{2}" id="{3}">
					{0}<br>{1}
				</div>`;
var line = `<div class="line {0}" id="{1}"></div>`;

var event_direction = `<div class="item {0}" id="{2}">{1}</div>`
var event_info = `<div class="event_info" id="{1}">{0}</div>`
var year_events = `<div class="year" id="{2}"><div class="time" id="{3}"><div class="text-inner">{1}</div></div>{0}</div>`
var event_group = `<div class="items">{0}</div>`

const safe_distance = 10;


addEventListener("load", function () {
	//prepare_time_line();
	
	
});

function get_year_id(counter) {
	return "year-"+counter;
}

function get_time_id(counter) {
	return "time-"+counter;
}

function get_line_id(year_div_id, counter) {
	return year_div_id + "-line-"+counter;
}

function get_item_id(year_div_id, counter) {
	return year_div_id + "-item-"+counter;
}

function get_item_description_id(year_div_id, counter) {
	return year_div_id + "-description-"+counter;
}

function get_event_info_id(year_div_id, counter) {
	return year_div_id + "-event-info-"+counter;
}

function prepare_time_line() {
	for(var counter = 0; counter < timeline.length; counter++) {
		const year_data = timeline[counter];
		const year_div_id = get_year_id(counter);
		const time_div_id = get_time_id(counter);
		console.log(year_data, year_div_id, time_div_id); 
		document.getElementById("timeline").innerHTML += fill_year_data(year_data, year_div_id, time_div_id);
	}
	adjust_widths();
}


function adjust_and_get_date_div_width(year_div_id, time_div_id) {
	const style = window.getComputedStyle(document.getElementById(year_div_id));
	console.log("adjust_and_get_date_div_width: " + year_div_id + ' ' +  time_div_id + ' ' +  style.width)
    document.getElementById(time_div_id).style.width = style.width;
    return parseInt(style.width.replace('px',''), 10);
}

function increase_timeline_width_by(width_delta) {
	const current_width = parseInt(document.getElementById("timeline").style.width.replace('px',''), 10);
	console.log("current_width : " + parseInt(document.getElementById("timeline").style.width.replace('px',''), 10));
	var final_width = width_delta;
	if(!isNaN(current_width)) final_width = current_width + width_delta
	document.getElementById("timeline").style.width = final_width + "px";
}

function get_item_direction(event_counter) {
	return event_counter % 2 == 0 ? orientation["UP"] : orientation["DOWN"];
}

function get_relative_line_position(item_rect) {
	return item_rect.width / 2;
}

function get_item_end_x(item_rect) {
	return item_rect.x + item_rect.width;
}

function get_line_end_x(item_rect) {
	return item_rect.x + get_relative_line_position(item_rect);
}

function adjust_widths() {
	
	setTimeout(function() {
		var counter = 0;
		for(;counter < timeline.length; counter++) {
			const year_data = timeline[counter];
			const year_div_id = get_year_id(counter);
			const time_div_id = get_time_id(counter);
			//set_time_bar_width(year_div_id, time_div_id);
			
			var previous_item_counter = null;
			var previous_same_orientation_item_counter = -2;
			for(var event_counter = 0; event_counter < year_data["events"].length; event_counter++, previous_same_orientation_item_counter++) {
				shift_item(year_div_id, event_counter, previous_item_counter, previous_same_orientation_item_counter, time_div_id);
				previous_item_counter = event_counter;
			}
			set_time_bar_width(year_div_id, time_div_id);
		}

	}, 100);
}

function shift_item(year_div_id, event_counter, previous_item_counter, previous_same_orientation_item_counter, time_div_id) {
	if(previous_item_counter == null) {
		set_time_bar_width(year_div_id, time_div_id);
		return;
	}

	setTimeout(function() {
		if(is_prev_same_orientation_item_known(previous_same_orientation_item_counter)) {
			smart_shift_item(year_div_id, event_counter, previous_item_counter, previous_same_orientation_item_counter, time_div_id)
		} else {
			shift_item_wrt_prev_only(year_div_id, event_counter, previous_item_counter);
		}
		//set_time_bar_width(year_div_id, time_div_id);
	}, 100);
}

function is_prev_same_orientation_item_known(counter) {
	return counter >= 0;
}

function shift_item_wrt_prev_only(year_div_id, event_counter, previous_item_counter){
	const previous_item_div_id = get_item_id(year_div_id, previous_item_counter);
	const current_item_div_id = get_item_id(year_div_id, event_counter);
	const previous_item_rect = document.getElementById(previous_item_div_id).getBoundingClientRect();
	const current_item_rect = document.getElementById(current_item_div_id).getBoundingClientRect();
	document.getElementById(current_item_div_id).style.margin = "0px 0px 0px -" + (get_relative_line_position(previous_item_rect) + get_relative_line_position(current_item_rect) - safe_distance) + "px";
}

function smart_shift_item(year_div_id, event_counter, previous_item_counter, previous_same_orientation_item_counter, time_div_id) {

	const previous_item_div_id = get_item_id(year_div_id, previous_item_counter);
	
	const current_item_div_id = get_item_id(year_div_id, event_counter);
	const current_line_div_id = get_line_id(year_div_id, event_counter);
	const current_item_description_div_id = get_item_description_id(year_div_id, event_counter);
	const current_event_info_div_id = get_event_info_id(year_div_id, event_counter);
	
	const previous_same_orientation_item_description_div_id = get_item_description_id(year_div_id, previous_same_orientation_item_counter);
	const previous_same_orientation_item_div_id = get_item_id(year_div_id, previous_same_orientation_item_counter);
	const previous_same_orientation_line_div_id = get_line_id(year_div_id, previous_same_orientation_item_counter);
	const previous_same_orientation_event_info_div_id = get_event_info_id(year_div_id, previous_same_orientation_item_counter);
	

	const previous_item_rect = document.getElementById(previous_item_div_id).getBoundingClientRect();
	const previous_same_orientation_item_rect = document.getElementById(previous_same_orientation_item_div_id).getBoundingClientRect();
	const current_item_rect = document.getElementById(current_item_div_id).getBoundingClientRect();
	const current_item_description_rect = document.getElementById(current_item_description_div_id).getBoundingClientRect();
	const current_event_info_rect = document.getElementById(current_event_info_div_id) == null ? null : document.getElementById(current_event_info_div_id).getBoundingClientRect();
	const time_rect = document.getElementById(time_div_id).getBoundingClientRect();
	const previous_same_orientation_item_description_rect = document.getElementById(previous_same_orientation_item_description_div_id).getBoundingClientRect();
	const previous_same_orientation_line_rect = document.getElementById(previous_same_orientation_line_div_id).getBoundingClientRect();
	const previous_same_orientation_event_info_rect = document.getElementById(previous_same_orientation_event_info_div_id) == null ? null : document.getElementById(previous_same_orientation_event_info_div_id).getBoundingClientRect();

	const previous_line_x = previous_item_rect.x + get_relative_line_position(previous_item_rect);
	//const previous_same_orientation_end_x = previous_same_orientation_item_rect.x + previous_same_orientation_item_rect.width;
	const previous_same_orientation_line_x = previous_same_orientation_item_rect.x + get_relative_line_position(previous_same_orientation_item_rect);
	const previous_same_orientation_height = previous_same_orientation_item_rect.height;
	const current_height = current_item_rect.height;
	const current_x = current_item_rect.x;

	if(is_overlap_possible(previous_same_orientation_item_rect, previous_item_rect, current_item_rect)) {
		console.log("overlap of " + current_item_div_id + " with " + previous_same_orientation_item_div_id + " " + previous_item_div_id + " " + time_rect.y);

		const item_direction = get_item_direction(event_counter);
		if(item_direction["item_direction"] == "item-up") {
			const new_y = get_adjusted_y_wrt_prev_up(previous_same_orientation_item_rect, previous_same_orientation_line_rect, previous_same_orientation_item_description_rect, 
				current_item_description_rect, current_event_info_rect);
			console.log("new_y up " + new_y)
			const new_line_height = get_line_height_from_time_up(new_y, time_rect, current_item_description_rect);
			console.log("new_line_height up " + new_line_height);
			document.getElementById(current_line_div_id).style.height = new_line_height + "px";
		} else {
			const new_y = get_adjusted_y_wrt_prev_down(previous_same_orientation_item_rect, previous_same_orientation_line_rect, previous_same_orientation_item_description_rect, 
				current_item_description_rect, current_event_info_rect);
			console.log("new_y down " + new_y)
			const new_line_height = get_line_height_from_time_down(new_y, time_rect, current_item_description_rect);
			console.log("new_line_height down " + new_line_height);
			document.getElementById(current_line_div_id).style.height = new_line_height + "px";
			
		}
		const new_rect_x = get_adjusted_line_x(previous_same_orientation_item_rect, previous_same_orientation_event_info_rect, previous_item_rect, current_item_rect);
		console.log("new_rect_x " + new_rect_x)
		const margin_left = get_adjusted_margin_left(new_rect_x, current_item_rect);
		console.log("margin_left " + margin_left)
		document.getElementById(current_item_div_id).style.margin = "0px 5px 0px -" + margin_left + "px";
		
		return;
	}

	shift_item_wrt_prev_only(year_div_id, event_counter, previous_item_counter);
}

function get_adjusted_y_wrt_prev_up(previous_same_orientation_item_rect, previous_same_orientation_line_rect, previous_same_orientation_item_description_rect, 
	current_item_description_rect, current_event_info_rect) {
	console.log("previous_same_orientation_item_rect.y = " + previous_same_orientation_item_rect.y + ", current_item_description_rect.height = " + current_item_description_rect.height);
	const gap = get_gap_between_item_and_time(previous_same_orientation_line_rect);
	console.log("gap = " + gap);

	if(gap > get_description_height_to_fit(current_item_description_rect, current_event_info_rect)) {
		return previous_same_orientation_item_description_rect.y + previous_same_orientation_item_description_rect.height + safe_distance;
	}
	return previous_same_orientation_item_rect.y - current_item_description_rect.height - safe_distance;
}

function get_description_height_to_fit(current_item_description_rect, current_event_info_rect) {
	if(current_event_info_rect != null) {
		return current_item_description_rect.height + current_event_info_rect.height + safe_distance;
	}
	return current_item_description_rect.height + safe_distance;
}

function get_gap_between_item_and_time(previous_same_orientation_line_rect) {
	console.log("previous_same_orientation_line_rect.height = " + previous_same_orientation_line_rect.height);
	return previous_same_orientation_line_rect.height;
}

function get_line_height_from_time_up(new_y, time_rect, current_item_description_rect) {
	console.log("time_rect.y = " + time_rect.y + ", new_y = " + new_y + ", current_item_description_rect.height = " + current_item_description_rect.height);
	return time_rect.y - new_y - current_item_description_rect.height;
}

function get_adjusted_y_wrt_prev_down(previous_same_orientation_item_rect, previous_same_orientation_line_rect, previous_same_orientation_item_description_rect, 
	current_item_description_rect, current_event_info_rect) {
	console.log("previous_same_orientation_item_rect.y = " + previous_same_orientation_item_rect.y + ", current_item_description_rect.height = " + current_item_description_rect.height);
	const gap = get_gap_between_item_and_time(previous_same_orientation_line_rect);
	console.log("gap = " + gap);

	if(gap > get_description_height_to_fit(current_item_description_rect, current_event_info_rect)) {
		return previous_same_orientation_item_description_rect.y - safe_distance;
	}
	return previous_same_orientation_item_rect.y + previous_same_orientation_item_rect.height + current_item_description_rect.height + safe_distance;
}

function get_line_height_from_time_down(new_y, time_rect, current_item_description_rect) {
	console.log("time_rect.y = " + time_rect.y + ", new_y = " + new_y + ", current_item_description_rect.height = " + current_item_description_rect.height);
	return new_y - (time_rect.y + time_rect.height) - current_item_description_rect.height;
}

function get_adjusted_line_x(previous_same_orientation_item_rect, previous_same_orientation_event_info_rect, previous_item_rect, current_item_rect) {
	const prev_line_x = get_line_end_x(previous_item_rect);
	const previous_same_orientation_line_x = get_line_end_x(previous_same_orientation_item_rect);

	var new_rect_x = previous_same_orientation_line_x + safe_distance;
	if(previous_same_orientation_event_info_rect != null) {
		const previous_same_orientation_event_info_end_x = get_item_end_x(previous_same_orientation_event_info_rect);
		console.log("previous_same_orientation_event_info_end_x " + previous_same_orientation_event_info_end_x)
		if(new_rect_x <= previous_same_orientation_event_info_end_x) new_rect_x = previous_same_orientation_event_info_end_x + safe_distance;
	}
	const new_rect_line_x = new_rect_x + get_relative_line_position(current_item_rect);
	console.log("new_line_x = " + new_rect_x + ", prev_line_x = " + prev_line_x + ", previous_same_orientation_line_x = " + previous_same_orientation_line_x);
	if(new_rect_line_x < prev_line_x) return get_adjusted_line_x_wrt_prev(previous_same_orientation_item_rect, previous_same_orientation_event_info_rect, previous_item_rect, current_item_rect) ;
	return new_rect_x;
}

function get_adjusted_line_x_wrt_prev(previous_same_orientation_item_rect, previous_same_orientation_event_info_rect, previous_item_rect, current_item_rect) {
	const prev_line_x = get_line_end_x(previous_item_rect);
	const current_line_x = get_line_end_x(current_item_rect);
	const previous_same_orientation_line_x = get_line_end_x(previous_same_orientation_item_rect);
	const new_rect_x = prev_line_x + safe_distance - get_relative_line_position(current_item_rect);
	console.log("previous_same_orientation_event_info_rect = " + previous_same_orientation_event_info_rect);
	if(previous_same_orientation_event_info_rect != null) {
		const previous_same_orientation_event_info_end_x = get_item_end_x(previous_same_orientation_event_info_rect);
		console.log("previous_same_orientation_event_info_end_x = " + previous_same_orientation_event_info_end_x + ", new_rect_x = " + new_rect_x);
		if(new_rect_x <= previous_same_orientation_event_info_end_x) return previous_same_orientation_event_info_end_x + safe_distance; 
	}

	if(new_rect_x > previous_same_orientation_line_x) return new_rect_x;
	return new_rect_x + get_relative_line_position(previous_same_orientation_item_rect);
}

function get_adjusted_margin_left(new_rect_x, current_item_rect) {
	return current_item_rect.x - new_rect_x;
}

function is_overlap_possible(previous_same_orientation_item_rect, previous_item_rect, current_item_rect) {
	const expected_x = get_relative_line_position(previous_item_rect) + get_relative_line_position(current_item_rect) - safe_distance;
	return (get_item_end_x(previous_same_orientation_item_rect) + safe_distance) >=  expected_x;
}

function set_time_bar_width(year_div_id, time_div_id) {
    setTimeout(function() {
        const date_div_width = adjust_and_get_date_div_width(year_div_id, time_div_id)
        increase_timeline_width_by(date_div_width + 25);
    }, 100);
};

function fill_year_data(year_data, year_div_id, time_div_id) {
	return format(year_events, [fill_events_data(year_data["events"], year_div_id), year_data["year"], year_div_id, time_div_id])
}

function fill_events_data(events_data, year_div_id) {
	var items_html = "";
	for(var counter = 0; counter < events_data.length; counter++) {
		event_data = events_data[counter];
		const line_div_id = get_line_id(year_div_id, counter);
		const description_div_id = year_div_id + "-description-"+counter;
		const event_info_div_id = year_div_id + "-event-info-"+counter;
		const item_div_id = get_item_id(year_div_id, counter);
		items_html += fill_event_direction(event_data, get_item_direction(counter), line_div_id, item_div_id, description_div_id, event_info_div_id);
	}
	return format(event_group, [items_html]);
}

function fill_event_direction(event_data, orientation, line_div_id, item_div_id, description_div_id, event_info_div_id) {

	var item_direction = orientation["item_direction"];
	var line_direction = orientation["line_direction"];

	return format(event_direction, [item_direction, fill_event_data(event_data, item_direction, line_direction, item_div_id, line_div_id, description_div_id, event_info_div_id), item_div_id]);
}

function fill_event_data(event_data, item_direction, line_direction, item_div_id, line_div_id, description_div_id, event_info_div_id) {
	var description_css = "description";
	var line_css = line_direction;

	if(event_data["type"] == "IMP") {
		description_css = "description imp-event-description";
		line_css = line_direction + " imp-event-line";
	}

	const main_event = format(event, [event_data["description"], event_data["date"] == null ? "" : "(" + event_data["date"] + ")", description_css, description_div_id]);
	const main_line = format(line, [line_css, line_div_id]);
	var event_info_html = "";
	if(event_data["info"] != null) {
		event_info_html = format(event_info, [event_data["info"], event_info_div_id])
	}

	if(item_direction == "item-up") return event_info_html + main_event + main_line;
	return main_line + main_event + event_info_html;
	
}


