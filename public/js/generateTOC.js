function generateTableOfContents() {
  var mainContent = document.getElementById('thecontent');
  if (!mainContent) {
    console.error('Element with id "thecontent" not found.');
    return;
  }

  var headers = mainContent.querySelectorAll('h1, h2, h3, h4, h5, h6');
  var toc = '<h1>Table of contents</h1>';
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

    toc += '<li><a href="#' + header.id + '">' + header.textContent + '</a>';
    currentLevel = level;
  }

  toc += '</li></ul>'.repeat(currentLevel);

  var mainContentText = mainContent.innerHTML;
  mainContentText = mainContentText.replace('[TOC]', toc);
  mainContent.innerHTML = mainContentText;
}
