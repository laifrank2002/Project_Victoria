// a map palette for a city handler 
var map_palette = (
	function()
	{
		var MAP_PALETTE_BUTTON_SIZE = {width: 25, height: 25};
		
		var selected = null;
		var options = [];
		
		var palette_buttons = [];
		
		var x = 650;
		var y = 150;
		var width = 150;
		var height = 300;
		
		var style = "red";
		
		var mouse_down = null;
		
		return {
			get MAP_PALETTE_BUTTON_SIZE() {return MAP_PALETTE_BUTTON_SIZE},
			get selected() {return selected},
			
			initialize: function()
			{
				palette_buttons.push(new map_palette_button(40,10,building_type["wood_cutter"]));
				palette_buttons.push(new map_palette_button(70,10,building_type["lumber_mill"]));
				palette_buttons.push(new map_palette_button(100,10,null));
				palette_buttons.push(new map_palette_button(10,40,building_type["dirt_path"]));
				
				var destroy_button = new map_palette_button(40,40,"destroy");
				destroy_button.icon_image = image_library["destroy"];
				palette_buttons.push(destroy_button);
			},
						
			draw: function(context)
			{
				context.fillStyle = style;
				context.beginPath();
				context.rect(x,y,width,height);
				context.fill();
				context.stroke();
				
				// draw the indicator of what's being selected!
				context.beginPath();
				context.rect(x + 10,y + 10,25,25);
				context.stroke();
				if (selected === "destroy")
				{
					 context.drawImage(image_library["destroy"],x+10,y+10,25,25);
				}
				else if (selected) context.drawImage(selected.icon_image,x+10,y+10,25,25);
				
				// now draw each of the UI buttons within using internal coordinates 
				for (var index = 0; index < palette_buttons.length; index++)
				{
					palette_buttons[index].draw(context,x,y);
				}
				
			},
			
			handle_mouse_down: function(mouseX, mouseY)
			{
				// convert to internal coordinates 
				var internal_mouseX = mouseX - x;
				var internal_mouseY = mouseY - y;
				
				for (var index = 0; index < palette_buttons.length; index++)
				{
					palette_buttons[index].handle_mouse_down(internal_mouseX,internal_mouseY);
				}
			},
			
			handle_mouse_up: function(mouseX, mouseY)
			{
				// convert to internal coordinates 
				var internal_mouseX = mouseX - x;
				var internal_mouseY = mouseY - y;
				
				for (var index = 0; index < palette_buttons.length; index++)
				{
					if(palette_buttons[index].isInBound(internal_mouseX,internal_mouseY))
					{
						palette_buttons[index].handle_mouse_up(internal_mouseX,internal_mouseY);
						return;
					}
				}
			},
			
			isInBound: function(mouseX, mouseY)
			{
				if(mouseX > x
					&& mouseY > y 
					&& mouseX < x + width 
					&& mouseY < y + height)
				{
					return true;
				}	
				return false;
			},
			
			set_selected: function(new_selected)
			{
				selected = new_selected;
			},
		}
	}
)();

// small display button
// NOT TO BE USED OUTSIDE OF MAP PALETTE 
function map_palette_button(x,y,building)
{
	this.x = x;
	this.y = y;
	this.width = map_palette.MAP_PALETTE_BUTTON_SIZE.width;
	this.height = map_palette.MAP_PALETTE_BUTTON_SIZE.height;
	
	this.building = building;
	if(this.building)
	{
		this.icon_image = building.icon_image;
	}
	this.mouse_downed = false;
}

map_palette_button.prototype.draw = function(context, x, y)
{
	context.beginPath();
	context.rect(this.x + x
		,this.y + y 
		,this.width
		,this.height);
	context.stroke();
	if(this.icon_image)
	{
		context.drawImage(this.icon_image
			,this.x + x
			,this.y + y 
			,this.width
			,this.height);
	}
}

map_palette_button.prototype.isInBound = function(x,y)
{
	if (x > this.x 
		&& y > this.y 
		&& x < this.x + this.width 
		&& y < this.y + this.height)
	{
		return true;
	}
	return false;
}

map_palette_button.prototype.handle_mouse_down = function(mouseX,mouseY)
{
	this.mouse_downed = false;
	if(this.isInBound(mouseX,mouseY))
	{
		this.mouse_downed = true;
	}
}

map_palette_button.prototype.handle_mouse_up = function()
{
	if(this.mouse_downed)
	{
		map_palette.set_selected(this.building);
		this.mouse_downed = false;
	}
}