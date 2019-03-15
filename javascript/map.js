// eine simple map, nothing but data
function Map(width, height, image)
{
	this.width = width;
	this.height = height;
	this.image = image;
	
	this.buildings = [];
	
	// occupied points on the map 
	this.occupied_map = [];
	for(var index = 0; index < this.width * this.height; index++)
	{
		this.occupied_map.push(false);
	}
}

// get real point 
Map.prototype.get_position_from_cartesian = function(x,y)
{
	return y*this.width + x;
}

// code 0, all good 
// code 1, invalid placement 
Map.prototype.add_building = function(x,y,type)
{
	// "overloading", not really
	var building = new Building(x,y,type);
	if(this.is_valid_building_placement(building.x,building.y,building.width,building.height))
	{
		// change the occupied!
		for (var index = 0; index < building.points.length; index++)
		{
			this.occupied_map[this.get_position_from_cartesian(building.points[index].x,building.points[index].y)] = building;
		}
		
		this.buildings.push(building);
		return 0;
	}
	else
	{
		return 1;
	}
}

// destroy
Map.prototype.destroy_building_at_coordinate = function(x,y)
{
	if(this.occupied_map[this.get_position_from_cartesian(x,y)])
	{
		var building = this.occupied_map[this.get_position_from_cartesian(x,y)];
		
		// change the occupied!
		for (var index = 0; index < building.points.length; index++)
		{
			this.occupied_map[this.get_position_from_cartesian(building.points[index].x,building.points[index].y)] = false;
		}
		
		// set as inactive 
		building.active = false;
	}
}

// getting building from tile
Map.prototype.get_building = function(x,y)
{
	return this.occupied_map[this.get_position_from_cartesian(x,y)];
}

// checks if all is clear 
Map.prototype.is_valid_building_placement = function(x,y,width,height)
{

	for(var x_index = 0; x_index < width; x_index++)
	{
		for(var y_index = 0; y_index < height; y_index++)
		{
			// if a result isn't even valid, falsify immediately and spare us an exception
			if(!this.is_valid_tile(x+x_index,y+y_index)) return false;
			if(this.occupied_map[this.get_position_from_cartesian(x+x_index,y+y_index)])
			{
				return false;
			}		
		}
	}
	return true;
}

Map.prototype.is_valid_tile = function(x,y)
{
	if (x < 0 || y < 0 || x >= this.width || y >= this.height) return false;
	return true;
}

Map.prototype.tick = function()
{
	// filter 
	this.buildings = this.buildings.filter(building => building.active);
	
	this.buildings.forEach(building => building.tick());
}