// Convert ((ref tags)) markers to clickable topic links
document.addEventListener(‘DOMContentLoaded’, function() {
// Find all text nodes in the body
function processTextNodes(node) {
if (node.nodeType === 3) { // Text node
const text = node.textContent;
const pattern = /((([^)]+)))/g;


  if (pattern.test(text)) {
    // Create a temporary div to hold the processed content
    const wrapper = document.createElement('span');
    
    // Replace all ((ref tags)) with links
    const newHTML = text.replace(/\(\(([^)]+)\)\)/g, function(match, content) {
      const parts = content.trim().split(/\s+/);
      if (parts.length < 2) return ''; // Invalid format
      
      const ref = parts[0]; // e.g., "1:5"
      const tags = parts.slice(1).join(' ').split(','); // Everything after first space
      
      // Create links for each tag
      const links = tags.map(tag => {
        const tagName = tag.trim();
        return `<a href="/topics.html#${tagName}" class="topic-tag">${tagName}</a>`;
      }).join(' ');
      
      return `<span class="topic-links">[${links}]</span>`;
    });
    
    wrapper.innerHTML = newHTML;
    
    // Replace the text node with the new content
    const parent = node.parentNode;
    while (wrapper.firstChild) {
      parent.insertBefore(wrapper.firstChild, node);
    }
    parent.removeChild(node);
  }
} else if (node.nodeType === 1 && node.nodeName !== 'SCRIPT' && node.nodeName !== 'STYLE') {
  // Element node - process children
  Array.from(node.childNodes).forEach(child => processTextNodes(child));
}

}

processTextNodes(document.body);
});