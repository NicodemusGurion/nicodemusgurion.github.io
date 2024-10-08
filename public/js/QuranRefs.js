function QuranRefs() {
    var mainDiv = document.getElementById("maincontent");
    var text = mainDiv.innerHTML;
    const regex = /(surah[s]*\s*[0-9\:\,\-\;\s]*[0-9])/gi;
    mainDiv.innerHTML = text.replace(regex, (match, surah) => SurahLink(surah));
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
  const bodyContent = document.body.innerHTML;

  // Loop through each mapping and apply the replacement
  for (const [hadithName, urlKeyword] of Object.entries(hadithMappings)) {
    // Create a regular expression to match the format "HadithName number" (e.g., "Sahih al-Bukhari 1234")
    const regex = new RegExp(`${hadithName} (\\d{1,5})`, 'g');

    // Replace the matched references with a hyperlink
    document.body.innerHTML = bodyContent.replace(regex, (match, number) => {
      return `<a href="https://sunnah.com/${urlKeyword}:${number}" target="_blank">${match}</a>`;
    });
  }
}

// Run the conversion function after the DOM content is loaded
document.addEventListener("DOMContentLoaded", QuranRefs);
document.addEventListener("DOMContentLoaded", convertHadithReferences);
