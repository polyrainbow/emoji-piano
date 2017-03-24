CLAVIATURE = (function () {
	'use strict';

	/*********************************************
		PRIVATE
	*********************************************/

	var config = {};
	var offset = 0;
	var k = 0;

	var key_colors = [
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


	var key_names = [
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


	var makeDiv = function(parent, id, className, innerHTML){
		var div = makeElement("div", id, className, parent, innerHTML);
		return div;
	};


	var createOctave = function(id, parent){
		var octave = makeDiv(parent, id, "octave");
		for (var i = 0; i < 12; i++){
			createKeyIfInRange(octave);
		}
	}


	var renderKeyboard = function(){

		var keyboard = makeDiv(g(config.container_id), config.id, config.className);

		var o0 = makeDiv(keyboard, "o0", "octave");

		createKeyIfInRange(o0);
		createKeyIfInRange(o0);
		createKeyIfInRange(o0);

		for (var o = 1; o < 8; o++){
			createOctave("o" + o, keyboard);
		}

		var o8 = makeDiv(keyboard, "o8", "octave");

		createKeyIfInRange(o8);

		keyboard.style.width = offset + "px";
		keyboard.style.zoom = config.zoom + "%";

	};


	var getMouseDownFunction = function(key, key_text){
		return function(e) {
			config.onmousedown(key);
			activateKey(key, key_text);
		};
	}

	var getMouseUpFunction = function(key, key_text){
		return function(e) {
			config.onmousedown(key);
			deactivateKey(key, key_text);
		};
	}

	var getMouseOutFunction = function(key, key_text){
		return function(e) {
			config.onmouseleave(key);
			deactivateKey(key, key_text);
		};
	}


	var renderKey = function(parent){

		var key_in_octave = (k + 9) % 12;
		var key_color = key_colors[key_in_octave];
		var octave = Math.floor((k + 9) / 12);

		if (config.custom_key_names){
			var key_text = config.custom_key_names[k];
		} else {
			key_text = key_names[key_in_octave]; // + octave;
		}

		var button = makeElement("button", "b" + k, "key " + key_color + "key", parent);
		button.addEventListener("mousedown", getMouseDownFunction(k, key_text));
		button.addEventListener("mouseup", getMouseUpFunction(k, key_text));
		button.addEventListener("mouseout", getMouseOutFunction(k, key_text));
		button.style.left = offset + "px";

		if (config.labels) {
			var label = makeElement("span", "", "key_label", button);
			label.innerHTML = key_text;
		}

		if (key_color == "black"){
			offset += 6; //black key width is 12, so go a half key further
		}

		else if ((key_in_octave == 4) || (key_in_octave == 11)){
			offset += 20; //after key 4 and 11, there's another white key, so go even further than usual
		}

		else {
			offset += 14; //after a white key, go 14px further to the right, until the beginning of the next black key
		}
		console.log(k);
		if (k === config.keysToRender[config.keysToRender.length - 1]){
			button.style.borderRightWidth = "1px";
		}

		return button;

	}


	var createKeyIfInRange = function(parent){

		if (config.keysToRender.indexOf(k) > -1){
			var button = renderKey(parent);
		}

		k++;

		return button;

	}


	var activateKey = function(key, note){
		g("b" + (key)).classList.add("active");
		config.onactivate(key, note);
	};


	var deactivateKey = function(key, note){

		if (!g("b" + key)){
			return false;
		}

		g("b" + (key)).classList.remove("active");
		config.ondeactivate(key, note);

	};


	/*********************************************
		PUBLIC
	*********************************************/

	var my = {};

	my.create = function(user_config){

		config = {
			start: user_config.start || 0,
			end: user_config.end || 87,
			onmousedown: user_config.onmousedown || function(){ return; },
			onclick: user_config.onclick || function(){ return; },
			onmouseup: user_config.onmouseup || function(){ return; },
			onmouseleave: user_config.onmouseleave || function(){ return; },
			onactivate: user_config.onactivate || function(){ return; },
			ondeactivate: user_config.ondeactivate || function(){ return; },
			container_id: user_config.container_id || document.body,
			labels: user_config.labels || false,
			id: user_config.id || "keyboard",
			className: user_config.className || "keyboard",
			custom_key_names: user_config.custom_key_names || null,
			zoom: user_config.zoom || 120
		};

		config.keysToRender = new Array(88);
		for (var i = 0; i < 88; i++) config.keysToRender[i] = i;
		config.keysToRender = config.keysToRender.filter(function(item){
			return ((item >= config.start) && (item <= config.end));
		});

		my.config = config;

		renderKeyboard();

	};


	my.getActiveKeys = function(){
		// TO DO
		return;
	};

	my.config = config;

	return my;

})();
