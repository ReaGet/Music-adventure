function Button(opts) {
	var x = opts.x || 0;
	var y = opts.y || 0;
	var width = opts.width || 0;
	var height = opts.height || 0;
	var color = opts.color || "#33eeff";
	var text = opts.text || "";
	var ctx = null;

	this.selected = false;

	this.init = function(context) {
		ctx = context;
		return this;
	};

	this.contain = function(m) {
		return m.x > x &&
			   m.x < x + width &&
			   m.y > y &&
			   m.y < y + height;
	}

	this.update = function(mouse) {

	};

	this.render = function() {
		ctx.fillStyle = this.selected ? "red" : color;
		ctx.fillRect(x, y, width, height);
		ctx.font = "30px Arial";
		let tw = ctx.measureText(text).width;
		ctx.fillStyle = "#fff";
		ctx.fillText(text, x + (width - tw) / 2, y + (height + 15) / 2);
	};
}

function ModalManager() {
	var ctx = null;
	var elements = [];
	var mouse = {};

	this.init = function(context) {
		ctx = context;

		window.addEventListener('mousedown', mousedown);
		window.addEventListener('mousemove', mousemove);
		window.addEventListener('mouseup', mouseup);

		return this;
	};

	function mousedown(e) {
		mouse.x = e.pageX;
		mouse.y = e.pageY;
		mouse.pressed = true;
	}

	function mousemove(e) {
		mouse.x = e.pageX;
		mouse.y = e.pageY;
	}

	function mouseup(e) {
		mouse.pressed = false;
	}
	
	this.add = function(elem) {
		elements.push(elem.init(ctx));
	};

	this.update = function() {
		for (let i = 0; i < elements.length; i++) {
			elements[i].update(mouse);
			elements[i].selected = false;
			if (elements[i].contain(mouse)) {
				elements[i].selected = true;
			}
		}
	};

	this.render = function() {
		for (let i = 0; i < elements.length; i++) {
			elements[i].render();
		}
	};
}