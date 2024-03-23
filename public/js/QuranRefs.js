function QuranRefs() {
    var mainDiv = document.getElementById("thecontent");
    var text = mainDiv.innerText;
    const regex = /surah[s]*\s*[0-9\:\,\-\;\s]*/gi;
    mainDiv.innerHTML = text.replace(regex, (match, surah) => SurahLink(surah.trim()));
    });
};


function SurahLink(input) {
    const surahs = input.split(';');
    const chapterLinks = surahs.map(chapter => ChapterLink(chapter));
    return chapterLinks.join(';');
}

function ChapterLink(input) {
    const chapter = parseInt(input.match(/\d+/)[0], 10);
    const versesLinks = input.split(',').map(verse => VersesLink(chapter, verse.trim()));
    return versesLinks.join(', ');
}

function VersesLink(chapter, verses) {
    const versesStripped = verses.replace(/[^\d-]/g, '');
    return `<a href="https://quran.com/${chapter}/${versesStripped}">${verses}</a>`;
}

function parseAndReplace(text) {
    const regex = /(surah[s]*\s*)([0-9\:\,\-\;\s]*)/gi;
    return text.replace(regex, (match, surah) => SurahLink(surah.trim()));
}
