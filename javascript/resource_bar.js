var resource_bar = (
	function()
	{
		
		var x = 0;
		var y = 0;
		var width = 650;
		var height = 50;
		
		var style = "red";
		return {
			initialize: function()
			{
			},
						
			draw: function(context)
			{
				context.fillStyle = style;
				context.beginPath();
				context.rect(x,y,width,height);
				context.fill();
				context.stroke();
				
				context.fillStyle = "black";
				// draw some numbers 
				context.fillText("Year: " + city_handler.data["statistics"]["time"]
					,x + 10
					,y + 25)
				context.stroke();
				
				context.fillText(city_handler.data["statistics"]["money"] + " db"
					,x + 150
					,y + 25)
				context.stroke();
			},
			
			handle_mouse_down: function(mouseX, mouseY)
			{
				// convert to internal coordinates 
				var internal_mouseX = mouseX - x;
				var internal_mouseY = mouseY - y;

			},
			
			handle_mouse_up: function(mouseX, mouseY)
			{
				// convert to internal coordinates 
				var internal_mouseX = mouseX - x;
				var internal_mouseY = mouseY - y;

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
		}
	}
)();