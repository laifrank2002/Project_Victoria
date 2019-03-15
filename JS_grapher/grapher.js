var grapher = (
	function()
	{
		var current_graph = null;
		
		return {
			get current_graph() {return current_graph},
			
			initialize: function()
			{
				// testing!
				var table1 = (grapher.generate_random_data(2,5));
				table1.sort_ascending(0);
				// testing 
				current_graph = new Graph("filled_linegraph", table1);
				current_graph.x = 100;
				current_graph.y = 25;
			},
			
			generate_random_data: function(columns,rows)
			{
				var axis_names = [];
				for(var x = 0; x < columns; x++)
				{
					axis_names.push("col"+x);
				}
				var new_table = new Table("random_data",axis_names);
				
				for(var y = 0; y < rows; y++)
				{
					var row = [];
					for(var x = 0; x < columns; x++)
					{
						row.push(Math.random()*10);
					}
					new_table.add_row(row);
				}
				
				return new_table;
			},
			
			draw: function(context)
			{
				if(current_graph)current_graph.draw(context);
			},
		}
	}
)();