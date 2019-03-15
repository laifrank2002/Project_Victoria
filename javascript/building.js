function Building(x,y,type)
{
	if (typeof type === "string")
	{
		if(building_type[type])
		{
			this.name = building_type[type].name;
			this.image = building_type[type].image;
			this.width = building_type[type].width;
			this.height = building_type[type].height;
			
			if (building_type[type].tick) this.on_tick = building_type[type].tick;
			
			this.image_index = 0;
			this.active = true; // for filtering 
			
			this.type = building_type[type];
			
			
		}
		else 
		{
			throw new Error("Building cannot be created, type does not exist.");
		}
	}
	else if (typeof type === "object")
	{
		this.name = type.name;
		this.image = type.image;
		this.width = type.width;
		this.height = type.height;
		
		if (type.tick) this.on_tick = type.tick;
		
		this.image_index = 0;
		this.active = true; // for filtering 
		
		this.type = type;
	}
	else
	{
		throw new Error("Typeof type is not valid. Accepted forms are string and buildings.");
	}
	
	// add in coordinates 
	this.points = [];
	for(var x_index = 0; x_index < this.width; x_index++)
	{
		for(var y_index = 0; y_index < this.height; y_index++)
		{
			this.points.push(new Point(x+x_index,y+y_index));
		}
	}
}

Building.prototype.draw = function(context, x,y)
{	
	// from x0, y0 and to width and height 
	context.drawImage(this.image[this.image_index]
		,this.points[0].x * city_handler.TILE_SIZE + x 
		,this.points[0].y * city_handler.TILE_SIZE + y
		,this.width * city_handler.TILE_SIZE
		,this.height * city_handler.TILE_SIZE);
	
}

Building.prototype.tick = function()
{
	if(this.on_tick)
	{
		this.on_tick();
	}
}

building_type = {
	"housing":{
		"name":"housing",
		"image": [image_library["tents"],image_library["shacks"],image_library["countryhouse"],image_library["house"],image_library["townhouse"]],
		"icon_image": image_library["tents"],
		"width": 1,
		"height": 1,
		
		"category": "housing",
		
		"capacity": 10,
		"cost": 10,
		"tax_revenue": 0,
		
		"tick": function()
		{
			
		},
	},
	"wood_cutter":{
		"name":"Wood Cutter's",
		"image": [image_library["wood_cutter"]],
		"icon_image": image_library["wood_cutter"],
		"width": 2,
		"height": 2,
		
		"category": "industry",
		
		"capacity": 8,
		"cost": 50,
		
		"tick": function()
		{
			
		},
	},
	"lumber_mill":{
		"name":"Lumber Mill",
		"image": [image_library["lumber_mill"]],
		"icon_image": image_library["lumber_mill"],
		"width": 3,
		"height": 2,
		
		"category": "lumber_mill",
		
		"capacity": 15,
		"cost": 80,
		
		"tick": function()
		{

		},
	},
	"dirt_path":{
		"name":"Dirt Path",
		"image": [image_library["dirt_path"]
			,image_library["dirt_path_1_N"]
			,image_library["dirt_path_1_S"]
			,image_library["dirt_path_1_E"]
			,image_library["dirt_path_1_W"]
			,image_library["dirt_path_2_NS"]
			,image_library["dirt_path_2_EW"]
			,image_library["dirt_path_2_EN"]
			,image_library["dirt_path_2_NW"]
			,image_library["dirt_path_2_SE"]
			,image_library["dirt_path_2_WS"]
			,image_library["dirt_path_3_N"]
			,image_library["dirt_path_3_S"]
			,image_library["dirt_path_3_E"]
			,image_library["dirt_path_3_W"]
			,image_library["dirt_path_4"]],
		"icon_image": image_library["dirt_path"],
		"width": 1,
		"height": 1,
		
		"category": "path",
		
		"capacity": null,
		"cost": 5,
	},
};