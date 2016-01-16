CLAVIATURE = (function () {
	'use strict';
	
	
	var g = function(id){
	
		return document.getElementById(id);
	
	};
	
	
	var makeElement = function (element_tag,element_id,element_class,parent_to_append_to,innerHTML){

		var element = document.createElement(element_tag);
		
		if (element_id !== ""){
			element.id = element_id;
		}
		
		if (element_class !== ""){
			element.className = element_class;
		}
		
		if (typeof parent_to_append_to != "undefined"){
			parent_to_append_to.appendChild(element);
		}
		
		if (innerHTML){
		
			element.innerHTML = innerHTML;
		
		}
		
		return element;
	};
	
	
	var makeDiv = function(parent,id,className,innerHTML){
	
		var div = makeElement("div",id,className,parent,innerHTML);
		
		return div;	
	
	};
	

	//PUBLIC
	var my = {};
	
	my.config = {};
	
	my.key_colors = [
		"white",
		"black",
		"white",
		"black",		
		"white",
		"white",
		"black",
		"white",
		"black",
		"white",
		"black",
		"white"
	];
	
	
	my.key_names = [
		"C",
		"C#",
		"D",
		"D#",		
		"E",
		"F",
		"F#",
		"G",
		"G#",
		"A",
		"A#",
		"B"
	];
	
	
	my.create = function(config){
	
		my.config = {
			start: config.start_key || 0,
			end: config.end_key || 88,
			onmousedown: config.onmousedown || function(){ return; },
			onclick: config.onclick || function(){ return; },
			onmouseup: config.onmouseup || function(){ return; },
			onmouseleave: config.onmouseleave || function(){ return; },
			onactivate: config.onactivate || function(){ return; },
			ondeactivate: config.ondeactivate || function(){ return; },
			container_id: config.container_id || document.body,
			labels: config.labels || false,
			id: config.id || "keyboard",
			className: config.className || "keyboard",
			custom_key_names: config.custom_key_names || null
		};		
		
		my.renderKeyboard();
	
	};
	
	
	my.renderKeyboard = function(){
	
		var k = 0;
		
		var keyboard = makeDiv(g(my.config.container_id), my.config.id, my.config.className);
		
		var o0 = makeDiv(keyboard, "o0", "octave");
		o0.style.left = octaveLeft + "px";
		
		my.createKey(0, 0, o0);
		my.createKey(1, 14, o0);
		my.createKey(2, 20, o0);
		
		var octaveLeft=40;
		
		k = 3;
		
		for (var o = 1; o < 8; o++){
			my.createOctave("o" + o, k, keyboard, octaveLeft);
			
			octaveLeft += 140;
			
			k = k + 12;
			
		}
		
		var o8 = makeDiv(keyboard, "o8", "octave");
		o8.style.left = octaveLeft + "px";
		my.createKey(87, 0, o8);
	
	};
	
	
	my.createKey = function(key, left, parent){
		
		if (my.config.custom_key_names){
			var key_text = my.config.custom_key_names[key];
		}
		
		else {
			key_text = my.key_names[(key + 9) % 12]; // + octave;
		}
		
		var key_color = my.key_colors[(key + 9) % 12];
		var octave = Math.floor((key + 9) / 12);

		var button = makeElement("button", "b" + key, "key " + key_color + "key", parent);
		button.addEventListener("mousedown", function() { my.config.onmousedown(key); my.activateKey(key, key_text); });
		button.addEventListener("mouseup", function() { my.config.onmouseup(key);  my.deactivateKey(key, key_text); });
		button.addEventListener("mouseout", function() { my.config.onmouseleave(key);  my.deactivateKey(key, key_text); });	
		
		button.style.left = left + "px";
		
		if (my.config.labels) {
		
			var label = makeElement("span", "", "key_label", button);
			label.innerHTML = key_text;
		
		}
		
		return button;

	}
	
	
	my.activateKey = function(key, note){
	
		g("b" + (key)).classList.add("active");
		
		my.config.onactivate(key, note);
		
	};
	
	
	my.deactivateKey = function(key, note){
		
		if (!g("b" + key)){
			return false;
		}

		g("b" + (key)).classList.remove("active");
		
		my.config.ondeactivate(key, note);
		
	};


	my.createOctave = function(id, start_key, parent, octave_left){

		var left = 0;
		
		var octave = makeDiv(parent, id, "octave");
		
		for (var i = 0; i < 12; i++){
		
			my.createKey(start_key + i, left, octave);
			
			if (my.key_colors[i] == "black"){ //black key width is 12
				left += 6;
			}
			
			else if (i == 4){
				left += 20;
			}
			
			else {
				left += 14;
			}
			
		}
		
		octave.style.left = octave_left + "px";
		
	}


	my.getActiveKeys = function(){
	
		// TO DO
		
		return;
		
	};
	
	
	return my;
	
})();
