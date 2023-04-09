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


var SearchDatabase; //undefined 

// this function is called when the user taps the search bar to lazy-load the search database
function loadDatabase()
{
  if SearchDatabase == undefined
  {
    $("searchMessage").html("Loading database...");
    $.getJSON("/database.json", function(json) {
      SearchDatabase = json;
$("searchMessage").html("Database loaded.");
    });
  }
}

function searchForArticles()
{
  var query = $("#searchQuery").value();
$("searchMessage").html("Searching for " + query);
  if SearchDatabase == undefined
  {
    $("#searchMessage").html("Database not loaded.");
    loadDatabase();
  }
  else
  {
    // prep output
    var resultList = {};
    var outputText = "<ul>";
    //split query into words 
    var searchWords = query.split(" ");
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
          var titleAndUrl = resultRow.key.split("|");
          outputText += "<ul><a href=\"" + titleAndUrl[1] + "\">" +titleAndUrl[0] + "</a></li>";
        }
      }
    }
    outputText += "</ul>";
    $("#searchResults").html(outputText);
    $("searchMessage").html("Search finished.");
  }
}
