// the all encompassing state manager
// makes saving and loading a HELL of a lot easier.
var data_manager = (
	function()
	{
		var data = {};
		
		return {
			// cooks up a blank state.
			initialize: function()
			{
				data["city"] = {};
				city_handler.initialize(data["city"]);
				
				
			},
		}
	}
)();

// alias, because we'll be using data_manage A LOT.
var DM = data_manager;