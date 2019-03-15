// overlays 
// walkers - pharaoh
// trading & diplo
// policies and edicts AND budget
// houses/wealth level?

// manages the city page 
var city_handler = (
	function()
	{
		// 1 ms = 1 tick
		var DEFAULT_TICKS_PER_TURN = 500;
		var TILE_SIZE = 32;
		
		var data = null;
		var map = null;
		var statistics = null;
		// time 
		var tickbank = 0;
		var ticks_per_turn = DEFAULT_TICKS_PER_TURN;
		var speed = 1;
		
		// inputs 
		var keys_pressed = [];
		var mouse_down = null;
		
		// ui 
		var ui_elements = [];		
		
		var bounding_rectangle = {min_x: 0, min_y: 0, max_x: 1024, max_y: 1024};
		var viewport = {x: 0, y: 0, width: 800, height: 500};
		
		return {
			get TILE_SIZE() {return TILE_SIZE},
			
			get bounding_rectangle() {return bounding_rectangle},
			get viewport() {return viewport},
			get keys_pressed() {return keys_pressed},
			
			get data() {return data},
			
			initialize: function(initialize_data)
			{	
				data = initialize_data;
				data["map"] = new Map(32,32,image_library["grasslands"]);
				data["statistics"] = {};
				
				map = data["map"];
				statistics = data["statistics"];
				
				// init ui elements 
				map_palette.initialize();
				
				// add in all of the stats 
				// these are UNDERIVED statistics, ie not population, as that's a derived statistic 
				// things like buildings construcuted, vs buildings on the map.
				statistics["money"] = 500;
				statistics["time"] = 0;
			},
			
			draw: function(context)
			{
				
				// adjust viewport to accomodate
				if(mouse_down)
				{
					viewport.x = Engine.cursor_x - mouse_down.x;
					viewport.y = Engine.cursor_y - mouse_down.y;
				}
				// first draw thy map 
				if(data["map"].image) 
				{
					context.drawImage(data["map"].image
						,viewport.x
						,viewport.y
						,viewport.width 
						,viewport.height
						,0
						,0
						,viewport.width
						,viewport.height);
				}
				// draw thy grid 
				context.lineWidth = 1;
				for(var x = 0; x < data["map"].width; x++)
				{
					for(var y = 0; y < data["map"].height; y++)
					{
						context.beginPath();
						context.rect(x * TILE_SIZE - viewport.x 
							,y * TILE_SIZE - viewport.y
							,TILE_SIZE 
							,TILE_SIZE);
						context.stroke();
					}
				}
				
				// then dry thy buildings 
				for (var index = 0; index < data["map"].buildings.length; index++)
				{
					// draw dirt paths differently 
					if (data["map"].buildings[index].name === "Dirt Path")
					{
						var image_number = 0;
						var point = data["map"].buildings[index].points[0];
						// get neigbours 
						var path_neighbours = {north:false,south:false,east:false,west:false};
						var neighbours = 0;
						// NSEW
						if (data["map"].is_valid_tile(point.x,point.y-1)) // N 
						{
							var building = data["map"].get_building(point.x,point.y-1);
							if(building)
							{
								if(building.name === "Dirt Path")
								{
									path_neighbours.north = true;
									neighbours+=1;
								}
							}

						}
						if (data["map"].is_valid_tile(point.x, point.y+1))
						{
							var building = data["map"].get_building(point.x,point.y+1);
							if(building)
							{
								if(building.name === "Dirt Path")
								{
									path_neighbours.south = true;
									neighbours+=1;
								}
							}
						}
						if (data["map"].is_valid_tile(point.x+1, point.y))
						{
							var building = data["map"].get_building(point.x+1,point.y);
							if(building)
							{
								if(building.name === "Dirt Path")
								{
									path_neighbours.east = true;
									neighbours+=1;
								}
							}
						}
						if (data["map"].is_valid_tile(point.x-1, point.y))
						{
							var building = data["map"].get_building(point.x-1,point.y);
							if(building)
							{
								if(building.name === "Dirt Path")
								{
									path_neighbours.west = true;
									neighbours+=1;
								}
							}
						}
						if (neighbours === 1)
						{
							if(path_neighbours.north)
							{
								image_number = 1;
							}
							else if (path_neighbours.south)
							{
								image_number = 2;
							}
							else if (path_neighbours.east)
							{
								image_number = 3;
							}
							else 
							{
								image_number = 4;
							}
						}
						else if (neighbours === 2)
						{
							if (path_neighbours.north && path_neighbours.south)
							{
								image_number = 5;
							}
							else if (path_neighbours.west && path_neighbours.east)
							{
								image_number = 6;
							}
							else if(path_neighbours.north && path_neighbours.east)
							{
								image_number = 7;
							}
							else if (path_neighbours.north && path_neighbours.west)
							{
								image_number = 8;
							}
							else if (path_neighbours.south && path_neighbours.west)
							{
								image_number = 10;
							}
							else 
							{
								image_number = 9;
							}
						}
						else if (neighbours === 3)
						{
							if(path_neighbours.north && !path_neighbours.south)
							{
								image_number = 11;
							}
							else if (path_neighbours.south && !path_neighbours.north)
							{
								image_number = 12;
							}
							else if (path_neighbours.east && !path_neighbours.west)
							{
								image_number = 13;
							}
							else  
							{
								image_number = 14;
							}
						}
						else if (neighbours === 4)
						{
							image_number = 15;
						}
						data["map"].buildings[index].image_index = image_number;
						data["map"].buildings[index].draw(context,-viewport.x,-viewport.y);
						
					}
					else 
					{
						data["map"].buildings[index].draw(context,-viewport.x,-viewport.y);
					}
				}
				
				
				
				// get closed from map, then draw a selected building
				if(map_palette.selected === "destroy")
				{
					
				}
				else if(map_palette.selected)
				{
					// rough approx. from engine.cursor 
					var x = Math.floor((Engine.cursor_x + viewport.x)/TILE_SIZE);
					var y = Math.floor((Engine.cursor_y + viewport.y)/TILE_SIZE);
					
					if(map.is_valid_tile(x,y))
					{
						context.drawImage(map_palette.selected.icon_image
							,x*TILE_SIZE - viewport.x 
							,y*TILE_SIZE - viewport.y
							,map_palette.selected.width * TILE_SIZE
							,map_palette.selected.height* TILE_SIZE);
							
						context.fillStyle = "white";
						context.strokeStyle = "black";
						context.miterLimit = 2;
						context.lineJoin = 'circle';
						context.lineWidth = 7;
						// also draw stats 
						// stroke in order for an outline
						context.strokeText(map_palette.selected.cost
							,x*TILE_SIZE - viewport.x 
							,y*TILE_SIZE - viewport.y);
						context.fillText(map_palette.selected.cost
							,x*TILE_SIZE - viewport.x 
							,y*TILE_SIZE - viewport.y);
					}
				}
				context.lineWidth = 1;
				// lastly draw UI over hand 
				map_palette.draw(context);
				resource_bar.draw(context);
				// draw a mini map 
				// draw the big over panel 
			},
			
			tick: function(lapse)
			{
				// we must cheat a little 
				//
				for (tickbank += lapse; tickbank > ticks_per_turn;tickbank -= ticks_per_turn)
				{
					// make the map tick 
					data["map"].tick();
					// perform auxillary functions
					
					
					// collect data for the map 
					
					statistics["time"]++;
				}
			},
			
			
			get_tile_from_cartesian: function(mouseX,mouseY)
			{
				return {x:Math.floor((mouseX + viewport.x)/TILE_SIZE),y:Math.floor((mouseY + viewport.y)/TILE_SIZE)};
			},
			
			handle_mouse_down: function(mouseX,mouseY)
			{
				// first handle mouse down for ui  
				if (map_palette.isInBound(mouseX,mouseY))
				{
					map_palette.handle_mouse_down(mouseX,mouseY);
					return;
				}
				else if (resource_bar.isInBound(mouseX,mouseY))
				{
					resource_bar.handle_mouse_down(mouseX,mouseY);
					return;
				}
				// handle tile last 
				var tile = city_handler.get_tile_from_cartesian(mouseX,mouseY);
				if(!data["map"].is_valid_tile(tile.x,tile.y))
				{
					tile = null;
				}
				
				// adjusting for viewport 
				mouse_down = {x:mouseX - viewport.x
					,y:mouseY - viewport.y
					,tile: tile};
				// Engine.log(mouse_down.tile);
				/*
				// tile clicked 
				Engine.log("mouse clicked on equivalent: " + (mouseX + viewport.x) + "," + (mouseY + viewport.y)
					+" that translates to the tile: " + Math.floor((mouseX + viewport.x)/TILE_SIZE) + "," + Math.floor((mouseY + viewport.y)/TILE_SIZE));
				*/
			},
			
			handle_mouse_up: function(mouseX,mouseY)
			{
				
				
				// first handle UI elements 
				if (map_palette.isInBound(mouseX,mouseY))
				{
					map_palette.handle_mouse_up(mouseX,mouseY);
					return;
				}	
				else if (resource_bar.isInBound(mouseX,mouseY))
				{
					resource_bar.handle_mouse_up(mouseX,mouseY);
					return;
				}
				
				if(!mouse_down)return;
				// handle tile last 
				if(mouse_down.tile)
				{
					var tile = city_handler.get_tile_from_cartesian(mouseX,mouseY);
					if(!data["map"].is_valid_tile(tile.x,tile.y))
					{
						tile = null;
					}
					if (tile)
					{
						// if within borders 
						if(tile.x === mouse_down.tile.x && tile.y === mouse_down.tile.y)
						{
							// check if selected, if so, plop down a building!
							// unless the command is set to destroy, in which case, destroy
							if (map_palette.selected === "destroy")
							{
								data["map"].destroy_building_at_coordinate(tile.x,tile.y);
							}
							else if(map_palette.selected)
							{
								city_handler.buy_building(tile.x,tile.y,map_palette.selected);
							}
							
							
						}
					}
				}
									
				mouse_down = null;
			},
			
			buy_building: function(x,y,building)
			{
				if (data["map"].is_valid_building_placement(x,y,building.width,building.height))
				{
					if (data["statistics"]["money"] >= building.cost)
					{
						data["map"].add_building(x,y,building);
						data["statistics"]["money"] -= building.cost;
					}
				}
			},	
			
			
			// setting speed  
			set_speed: function(new_speed)
			{
				speed = new_speed;
				ticks_per_turn = DEFAULT_TICKS_PER_TURN/new_speed;
			},
			
		}
	}
)();