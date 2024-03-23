 function QuranRefs() {
    var mainDiv = document.getElementById("thecontent");
    var text = mainDiv.innerText;
    
    var quranRefRegex = /\b(Surah\s*\d+)(?::|;|,|\s+)((?:\d+:\d+(?:-\d+)?(?:,|$))+)/g;
    
    text = text.replace(quranRefRegex, function(match, surah, verses) {
        var verseArray = verses.split(',');
        var replacedVerses = verseArray.map(function(verse) {
            var parts = verse.split(':');
            var chapter = parts[0];
            var verseRange = parts[1].split('-');
            var startVerse = verseRange[0];
            var endVerse = verseRange[1] || startVerse;
            return '<a href="https://quran.com/' + chapter + '/' + startVerse + (startVerse !== endVerse ? '-' + endVerse : '') + '">' + chapter + ':' + startVerse + (startVerse !== endVerse ? '-' + endVerse : '') + '</a>';
        });
        return surah + replacedVerses.join(',');
    });

    mainDiv.innerHTML = text;
};