var SearchDatabase;
	function loadDatabase() //load database if not loaded
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
	function applySuggestion(suggestedWord)
	{
		let searchQueryWords = document.querySelector("#searchQuery").value.trim().toLowerCase().split(" "); //get current query split into an array
		searchQueryWords.pop(); //remove last word
		searchQueryWords.push(suggestedWord); //push the suggestion to the end
		let newQuery = searchQueryWords.join(" ");
		document.querySelector("#searchQuery").value = newQuery;
		document.querySelector('#searchQuery').focus(); //put focus on the input field
		searchInDatabase(newQuery); //execute the query
	}
  
  function searchInDatabase(query) //search for a query text
  {
    if (SearchDatabase === undefined) //make sure db is loaded
    {
      loadDatabase();
  	  return;
    }
	var queryWords = query.toLowerCase().trim().replace(/[\'\’\ʹ\·]/gi, "").split(" "); //prep query words by splitting

    if (query.trim().length == "" || queryWords.length == 0) //on empty query, show no result box
    {
      document.querySelector("#searchResults").style.display ="none";
    	return;
    }
    var foundMatches = {}; //a hash with the page ids where the words are found, and how many times a word is found on that page.
    var suggestedWords = []; //if the user writes a partial word not in the list, make some suggestions
    var lastWord = queryWords[queryWords.length - 1]; //get last word to generate suggestions.
	const sortedEntries = Object.entries(SearchDatabase.searchdata).sort((a, b) => b[1].length - a[1].length); //sort database words according to how many pages contain them
    sortedEntries.forEach(entry => {
	  	const key = entry[0];
	  	if (key.startsWith(lastWord) && key != lastWord) { //if a word starts with the word (but is not the word)
			suggestedWords.push(key) //add word to suggestions
		}
	});
	suggestedWords = suggestedWords.slice(0,10); //pick only first 10 suggestions

    for (queryWord of queryWords) //loop thru query word list
    {
		if (queryWord in SearchDatabase.searchdata) //check if the word exists in the db
    	{    	
    		for(pageIndex of SearchDatabase.searchdata[queryWord])
			{
				foundMatches[pageIndex] = 1 + (foundMatches[pageIndex] || 0) //increase the score for this page
				if (SearchDatabase.postlist[pageIndex].title.toLowerCase().includes(queryWord)) //if the word is even found in the title...
				{
					foundMatches[pageIndex] = 2 + (foundMatches[pageIndex] || 0); //increase the score even more because that's good stuff
				}
			}

    	}
    }
    var output = "";
    if (Object.keys(foundMatches).length === 0)
    {
    	for (queryWord of suggestedWords) //loop thru suggested word list
		{
			if (queryWord in SearchDatabase.searchdata) //check if the word exists in the db
			{    	
				for(pageIndex of SearchDatabase.searchdata[queryWord])
				{
					foundMatches[pageIndex] = 1 + (foundMatches[pageIndex] || 0) //increase the score for this page
					if (SearchDatabase.postlist[pageIndex].title.toLowerCase().includes(queryWord)) //if the word is even found in the title...
					{
						foundMatches[pageIndex] = 2 + (foundMatches[pageIndex] || 0); //increase the score even more because that's good stuff
					}
				}
			}
		}
		
		output += "<sub>(No exact matches. Result is based on suggested words.)</sub>";
    }
    console.log(foundMatches);

	if (Object.keys(foundMatches).length === 0) //If it turns out we couldn't find anything, output a no result box
    {
    	output = "No results.";
    }
    else
    {
		const fm_arr = Object.entries(foundMatches); //sort the results according to how many points it scored.
		fm_arr.sort((a, b) => b[1] - a[1]);
		//generate a html list of the results
		output += "<ul>";
		for (const [key, value] of fm_arr) {
			let thumb = (SearchDatabase.postlist[key].thumb != null ? "<img src=\"" + SearchDatabase.postlist[key].thumb + "\" class=\"featured-thumbnail-mini\" />": "")
			output += "<li>" + thumb + "<a href=\"" + SearchDatabase.postlist[key].url + "\">" + SearchDatabase.postlist[key].title + "</a></li>";  	
		}
		output += "</ul>";
    }
    if (suggestedWords.length > 0) //if there was an incomplete last word and there were similar words found, make a short list of them
    {
    	var suggestions = "";
    	for (suggestedWord of suggestedWords)
    	{
    		suggestions += "<span onclick=\"applySuggestion('" + suggestedWord.trim() + "')\" style=\"cursor: pointer;\"><u>" + suggestedWord.trim() + "</u></span> &nbsp;";
    	}
    	output = suggestions + "<br>" + output;
    }
    document.querySelector("#searchResults").innerHTML = output;
    document.querySelector("#searchResults").style.display ="block";
  }
