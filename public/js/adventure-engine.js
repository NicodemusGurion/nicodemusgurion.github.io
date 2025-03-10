/**
 * Choose Your Own Adventure Game Engine for GitHub Pages
 * Converts markdown content rendered by GitHub Pages into an interactive adventure game
 */

document.addEventListener('DOMContentLoaded', function() {
  // Create the adventure container
  const contentContainer = document.createElement('div');
  contentContainer.id = 'adventure-container';
  contentContainer.className = 'adventure-container';
  
  // Get the content from the page (rendered by GitHub Pages)
  const originalContent = document.getElementById('content');
  
  if (!originalContent) {
    console.error("Content container not found. Make sure you have a div with id='content'.");
    return;
  }
  
  // Parse the document content into story nodes
  const storyNodes = parseDocumentContent(originalContent);
  
  // Initialize the game
  if (Object.keys(storyNodes).length > 0) {
    // Replace content with our game container
    document.body.insertBefore(contentContainer, originalContent);
    originalContent.style.display = 'none';
    
    // Render the start node
    renderNode('start');
  } else {
    contentContainer.innerHTML = '<p>Error: No story content found. Check the structure of your markdown file.</p>';
    document.body.insertBefore(contentContainer, originalContent);
  }
  
  /**
   * Parse the document content into story nodes
   */
  function parseDocumentContent(contentElement) {
    const nodes = {};
    
    // Get all headings in the document
    const headings = contentElement.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    // If there are no headings, try to use the entire content as the start node
    if (headings.length === 0) {
      const paragraphs = contentElement.querySelectorAll('p');
      let startContent = '';
      let startChoices = [];
      
      // Add any paragraphs to the start content
      paragraphs.forEach(p => {
        startContent += p.outerHTML;
      });
      
      // Look for lists (choices)
      const lists = contentElement.querySelectorAll('ul');
      if (lists.length > 0) {
        startChoices = parseChoices(lists[0]);
      }
      
      nodes['start'] = {
        content: startContent,
        choices: startChoices
      };
      
      return nodes;
    }
    
    // Process the first heading differently - everything before it is the start node
    const firstHeading = headings[0];
    let startContent = '';
    let startChoices = [];
    let currentElement = contentElement.firstChild;
    
    // Collect all content before the first heading for the start node
    while (currentElement && currentElement !== firstHeading) {
      if (currentElement.nodeType === Node.ELEMENT_NODE) {
        if (currentElement.tagName === 'UL') {
          startChoices = parseChoices(currentElement);
        } else if (!['SCRIPT', 'STYLE'].includes(currentElement.tagName)) {
          startContent += currentElement.outerHTML;
        }
      }
      currentElement = currentElement.nextSibling;
    }
    
    // Special case: if the first heading is h1, we'll use it as part of the start node content
    if (firstHeading.tagName === 'H1') {
      startContent = firstHeading.outerHTML + startContent;
      nodes['start'] = {
        content: startContent,
        choices: startChoices
      };
      
      // Start processing with the second heading
      processHeadings(headings, 1);
    } else {
      // Otherwise, use the content before the first heading as the start node
      nodes['start'] = {
        content: startContent,
        choices: startChoices
      };
      
      // Process all headings
      processHeadings(headings, 0);
    }
    
    // Helper function to process headings and their content
    function processHeadings(headings, startIndex) {
      for (let i = startIndex; i < headings.length; i++) {
        const heading = headings[i];
        const headingId = heading.id || githubSlugify(heading.textContent);
        
        let nodeContent = heading.outerHTML;
        let nodeChoices = [];
        
        // Collect content until the next heading
        let nextElement = heading.nextSibling;
        while (nextElement && 
               !(nextElement.nodeType === Node.ELEMENT_NODE && 
                 ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(nextElement.tagName))) {
          
          if (nextElement.nodeType === Node.ELEMENT_NODE) {
            if (nextElement.tagName === 'UL') {
              nodeChoices = parseChoices(nextElement);
            } else if (!['SCRIPT', 'STYLE'].includes(nextElement.tagName)) {
              nodeContent += nextElement.outerHTML;
            }
          }
          
          nextElement = nextElement.nextSibling;
        }
        
        // Save this node
        nodes[headingId] = {
          content: nodeContent,
          choices: nodeChoices
        };
      }
    }
    
    return nodes;
  }
  
  /**
   * Parse a UL element into an array of choice objects
   */
  function parseChoices(ulElement) {
    const choices = [];
    const listItems = ulElement.querySelectorAll('li');
    
    listItems.forEach(li => {
      const text = li.textContent;
      const parts = text.split('>');
      
      if (parts.length >= 2) {
        const choiceText = parts[0].trim();
        const targetHeadingText = parts[1].trim();
        
        // Generate the target ID using GitHub-style slugification
        const targetId = githubSlugify(targetHeadingText);
        
        choices.push({
          text: choiceText,
          target: targetId
        });
      }
    });
    
    return choices;
  }
  
  /**
   * Convert a string into a GitHub-style slug ID
   */
  function githubSlugify(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\- ]/g, '') // Remove non-word chars except spaces and hyphens
      .replace(/\s+/g, '-')     // Replace spaces with hyphens
      .replace(/--+/g, '-')     // Replace multiple hyphens with single
      .replace(/^-|-$/g, '');   // Remove leading/trailing hyphens
  }
  
  /**
   * Render a story node and its choices
   */
  function renderNode(nodeId) {
    const node = storyNodes[nodeId];
    
    if (!node) {
      contentContainer.innerHTML = `<p>Error: Node "${nodeId}" not found.</p>`;
      return;
    }
    
    // Create the content element
    const contentElement = document.createElement('div');
    contentElement.className = 'adventure-content';
    contentElement.innerHTML = node.content;
    
    // Create choices
    const choicesElement = document.createElement('div');
    choicesElement.className = 'adventure-choices';
    
    if (node.choices.length === 0) {
      // No choices means the end of the adventure
      const endMessage = document.createElement('p');
      endMessage.className = 'adventure-end';
      endMessage.textContent = 'The End';
      choicesElement.appendChild(endMessage);
    } else {
      node.choices.forEach(choice => {
        const choiceButton = document.createElement('button');
        choiceButton.className = 'adventure-choice';
        choiceButton.textContent = choice.text;
        choiceButton.addEventListener('click', function() {
          renderNode(choice.target);
        });
        choicesElement.appendChild(choiceButton);
      });
    }
    
    // Clear and update the container
    contentContainer.innerHTML = '';
    contentContainer.appendChild(contentElement);
    contentContainer.appendChild(choicesElement);
    
    // Scroll to the top
    window.scrollTo(0, 0);
  }
});