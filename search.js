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
    var outputText = "<ul>"
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
        var resultArray = Object.keys(resultList).map(key => ({ key, value: resultList[key] }));
        resultArray.sort((a, b) => b.value - a.value);
        for (resultRow in resultArray)
        {
          var titleAndUrl = resultRow.key.split("|")
          outputText += "<ul><a href=\"" + titleAndUrl[1] + "\">" +titleAndUrl[0] + "</a></li>"
        }
      }
    }
    outputText += "</ul>"
    $("#searchResults").html(outputText)
  }
}