function QuranRefs() {
    var mainDiv = document.getElementById("maincontent");
    
    // Get all text nodes that are NOT inside <a> tags
    var walker = document.createTreeWalker(
        mainDiv,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: function(node) {
                // Reject if parent is a link
                if (node.parentElement.tagName === 'A') {
                    return NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_ACCEPT;
            }
        }
    );
    
    var textNodes = [];
    while (walker.nextNode()) {
        textNodes.push(walker.currentNode);
    }
    
    const regex = /(surah[s]*\s*[0-9\:\,\-\;\s]*[0-9])/gi;
    
    textNodes.forEach(node => {
        var text = node.textContent;
        if (regex.test(text)) {
            var span = document.createElement('span');
            span.innerHTML = text.replace(regex, (match) => SurahLink(match));
            node.parentNode.replaceChild(span, node);
        }
    });
}


function SurahLink(input) {
  const surahs = input.split(';');
  const chapterLinks = surahs.map(chapter => ChapterLink(chapter));
  return chapterLinks.join(';');
}

function ChapterLink(input) {
  const [chapterStr, verses] = input.split(':', 2);
  const chapter = chapterStr.replace(/[^\d]/g, '');
  const versesLinks = input.split(",").map(verses => VersesLink(chapter, verses));
  return versesLinks.join(', ');
}

function VersesLink(chapter, verses) {
  const versesStripped = verses.replace(/^[^:]*:/g, '').replace(/[^\d-]/g, '');
  return `<a href="https://quran.com/${chapter}/${versesStripped}" target="_blank">${verses}</a>`;
}

// Mapping of Hadith collection names to their corresponding URL keywords
const hadithMappings = {
  "Sahih al-Bukhari": "bukhari",
  "Sahih Muslim": "muslim",
  "Sunan Abu Dawood": "abudawud",
  "Jami` at-Tirmidhi": "tirmidhi",
  "Sunan an-Nasa'i": "nasai",
  "Sunan Ibn Majah": "ibnmajah",
  // Add more mappings as needed
};

// Function to convert Hadith references to links
function convertHadithReferences() {
  // Get the content of the page (or a specific container)
  const bodyContent = document.getElementById('maincontent');

  // Loop through each mapping and apply the replacement
  for (const [hadithName, urlKeyword] of Object.entries(hadithMappings)) {
    // Create a regular expression to match the format "HadithName number" (e.g., "Sahih al-Bukhari 1234")
    const regex = new RegExp(`${hadithName} (\\d{1,5})`, 'g');

    // Replace the matched references with a hyperlink
    bodyContent.innerHTML = bodyContent.innerHTML.replace(regex, (match, number) => {
      return `<a href="https://sunnah.com/${urlKeyword}:${number}" target="_blank">${match}</a>`;
    });
  }
}


function generateTableOfContents() {
  var mainContent = document.getElementById('maincontent');
  if (!mainContent) {
    return;
  }

  var headers = mainContent.querySelectorAll('h1:not(.page-title), h2, h3, h4, h5, h6');
  var toc = '<h1>Table of contents</h1>';
  var stoc = "";
  var currentLevel = 0;

  for (var i = 0; i < headers.length; i++) {
    var header = headers[i];
    var level = parseInt(header.tagName.charAt(1));

    if (level > currentLevel) {
      toc += '<ul>';
    } else if (level < currentLevel) {
      toc += '</li></ul>'.repeat(currentLevel - level) + '</li>';
    } else {
      toc += '</li>';
    }
	if (stoc !== "") {
		stoc += ", ";
	}
    toc += '<li><a href="#' + header.id + '">' + header.textContent + '</a>';
    stoc += '<a href="#' + header.id + '">' + header.textContent + '</a>';

    currentLevel = level;
  }

  toc += '</li></ul>'.repeat(currentLevel);
  
  var mainContentText = mainContent.innerHTML;
  mainContentText = mainContentText.replace('[TOC]', toc);
  mainContentText = mainContentText.replace('[STOC]', stoc);
  mainContent.innerHTML = mainContentText;
}

// Compute the edit distance between the two given strings
function levenshtein(a, b) {
  if (a.length === 0) return b.length; 
  if (b.length === 0) return a.length;

  var matrix = [];

  // increment along the first column of each row
  var i;
  for (i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  // increment each column in the first row
  var j;
  for (j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for (i = 1; i <= b.length; i++) {
    for (j = 1; j <= a.length; j++) {
      if (b.charAt(i-1) == a.charAt(j-1)) {
        matrix[i][j] = matrix[i-1][j-1];
      } else {
        matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                                Math.min(matrix[i][j-1] + 1, // insertion
                                         matrix[i-1][j] + 1)); // deletion
      }
    }
  }

  return matrix[b.length][a.length];
};

function runAllExtras(){
generateTableOfContents();
//QuranRefs();
//convertHadithReferences()
}

window.onload = runAllExtras;