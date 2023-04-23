(function(document) {
  var toggle = document.querySelector('.sidebar-toggle');
  var sidebar = document.querySelector('#sidebar');
  var checkbox = document.querySelector('#sidebar-checkbox');

  document.addEventListener('click', function(e) {
    var target = e.target;

    if(!checkbox.checked ||
       sidebar.contains(target) ||
       (target === checkbox || target === toggle)) return;

    checkbox.checked = false;
  }, false);
})(document);


var SearchDatabase;

	function loadDatabase()
	{
		if (SearchDatabase === undefined)
		{
		  fetch("/database.json")
		  .then(response => response.json())
		  .then(data => {
			SearchDatabase = data;
		  })	
		}
	}
  
  function searchInDatabase(query)
  {
    if (SearchDatabase === undefined)
    {
	  document.querySelector("#searchResults").innerHTML = "Database not loaded.";
	  return;
    }
    var queryWords = query.toLowerCase().trim().split(" ");
    if (query.trim().length == "")
    {
    	document.querySelector("#searchResults").innerHTML = "No results.";
    	return;
    }
    var foundMatches = {};
    for (queryWord of queryWords)
    {
    	var queryKey = queryWord
    	if (!(queryWord in SearchDatabase.searchdata)) //if the key does not exist, look for a partial match
    	{
    	  for (const [key, value] of Object.entries(SearchDatabase.searchdata)) {
			if (key.startsWith(queryWord)) {
			console.log(key);
			  queryKey = key;
			  break;
			}
		  }
    	}
		if (queryKey in SearchDatabase.searchdata)
    	{    	
    		for (const key in SearchDatabase.searchdata[queryKey])
    	  	{
    	  		if (key in foundMatches)
    	  		{ 
    	  			foundMatches[key] += SearchDatabase.searchdata[queryKey][key];
    	  		}
    	  		else
    	  		{
    	  			foundMatches[key] = SearchDatabase.searchdata[queryKey][key];
    	  		}
    	  	}
    	}
    }
	if (Object.keys(foundMatches).length === 0)
    {
    	document.querySelector("#searchResults").innerHTML = "No results.";
    	return;
    }
    const fm_arr = Object.entries(foundMatches);
    fm_arr.sort((a, b) => b[1] - a[1]);
    output = "<ul>";
    for (const [key, value] of fm_arr) {
		output += "<li><a href=\"" + SearchDatabase.postlist[key].url + "\">" + SearchDatabase.postlist[key].title + "</a></li>";  	
    }
    output += "</ul>";
    document.querySelector("#searchResults").innerHTML = output;
  }
