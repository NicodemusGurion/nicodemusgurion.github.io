var SearchDatabase //undefined 

// this function is called when the user taps the search bar to lazy-load the search database
function loadDatabase()
{
  if SearchDatabase == undefined
  {
    $.getJSON("/database.json", function(json) {
      SearchDatabase = json;
    });
  }
}

function searchForArticles(query)
{
  if SearchDatabase == undefined
  {
    $("#searchResults").html("Database not loaded.")
    loadDatabase()
  }
  else
  {
    // prep output
    var resultList = {}
    //split query into words 
    var searchWords = query.split(" ")
    //check each search word 
    for (searchWord in searchWords)
    {
      if searchWord in SearchDatabase
      {
        for (let key in SearchDatabase) {
          if (SearchDatabase.hasOwnProperty(key)) {
            if (resultList.hasOwnProperty(key)) {
              resultList[key] += SearchDatabase[key];
            } else {
              resultList[key] = SearchDatabase[key];
            }
          }
        }
      }
    }
  }
}
