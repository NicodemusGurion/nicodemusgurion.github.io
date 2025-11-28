// Convert <tags> elements to clickable topic links
document.addEventListener(‘DOMContentLoaded’, function() {
const tagElements = document.querySelectorAll(‘tags’);

tagElements.forEach(el => {
// Get all attributes
const attrs = el.attributes;

```
// Find the attribute with format "ref=tags" (e.g., "1:5=prayer,guidance")
for (let attr of attrs) {
  const match = attr.name.match(/^(\d+:\d+)$/);
  if (match) {
    const ref = match[1];  // e.g., "1:5"
    const tagsList = attr.value.split(',');
    
    // Create links for each tag
    const links = tagsList.map(tag => {
      const tagName = tag.trim();
      return `<a href="/topics.html#${tagName}" class="topic-tag">${tagName}</a>`;
    }).join(' ');
    
    // Replace the <tags> element with the links
    const span = document.createElement('span');
    span.className = 'topic-links';
    span.innerHTML = ' [' + links + ']';
    el.parentNode.replaceChild(span, el);
    
    break;  // Stop after finding the first matching attribute
  }
}
```

});
});