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
      loadDatabase();
  	  return;
    }
    var queryWords = query.toLowerCase().trim().split(" ");
    if (query.trim().length == "")
    {
      document.querySelector("#searchResults").style.display ="none";
    	return;
    }
    var foundMatches = {};
    var suggestWords = false;
    var suggestedWords = "";
    for (queryWord of queryWords)
    {
    	if (!(queryWord in SearchDatabase.searchdata)) //if the key does not exist, look for a partial match
    	{
    	  for (const [key, value] of Object.entries(SearchDatabase.searchdata)) {
			if (key.startsWith(queryWord)) {
			  queryWord = key;
			  suggestWords = true;
			  break;
			}
		  }
    	}
		if (queryWord in SearchDatabase.searchdata)
    	{    	
    		for (const pageIndex in SearchDatabase.searchdata[queryWord])
    	  	{
    	  		foundMatches[pageIndex] = 1 + (foundMatches[pageIndex] || 0)
    	  		if (SearchDatabase.postlist[pageIndex].title.includes(queryWord))
    	  		{
    	  			foundMatches[pageIndex] += 2
    	  		}
    	  	}
    	}
    	suggestedWords += " " + queryWord;
    }
	if (Object.keys(foundMatches).length === 0)
    {
    	document.querySelector("#searchResults").innerHTML = "No results.";
      document.querySelector("#searchResults").style.display ="block";
    	return;
    }
    const fm_arr = Object.entries(foundMatches);
    fm_arr.sort((a, b) => b[1] - a[1]);
    output = "<ul>";
    for (const [key, value] of fm_arr) {
		output += "<li><a href=\"" + SearchDatabase.postlist[key].url + "\">" + SearchDatabase.postlist[key].title + "</a></li>";  	
    }
    output += "</ul>";
    if (suggestWords)
    {
    	output = "<span onclick=\"document.querySelector('#searchQuery').value = '" + suggestedWords.trim() + " ';document.querySelector('#searchQuery').focus()\"><u>" + suggestedWords.trim() + "</u></span>" + output;
    }
    document.querySelector("#searchResults").innerHTML = output;
    document.querySelector("#searchResults").style.display ="block";

  }
