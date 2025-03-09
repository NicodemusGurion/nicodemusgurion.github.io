/**
 * Choose Your Own Adventure Game Engine for GitHub Pages
 * This script converts a markdown document into an interactive adventure game.
 */

document.addEventListener('DOMContentLoaded', function() {
  // Get the content container where the story will be displayed
  const contentContainer = document.createElement('div');
  contentContainer.id = 'adventure-container';
  contentContainer.className = 'adventure-container';
  document.body.appendChild(contentContainer);
  
  // Extract all content from the document
  const documentContent = document.body.innerHTML;
  
  // Parse the document content into story nodes
  const storyNodes = parseDocumentContent(documentContent);
  
  // Initialize the game
  if (Object.keys(storyNodes).length > 0) {
    renderNode('start');
  } else {
    contentContainer.innerHTML = '<p>Error: No story content found.</p>';
  }
  
  /**
   * Parse the document content into story nodes
   */
  function parseDocumentContent(content) {
    // Create a temporary element to work with the content
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = content;
    
    // Get all elements in the document
    const allElements = Array.from(tempContainer.children);
    
    // Create an object to store our story nodes
    const nodes = {};
    
    // Extract the start node (everything before the first heading)
    let startContent = '';
    let startChoices = [];
    let index = 0;
    
    // Collect content until we hit a heading
    while (index < allElements.length && 
           !['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(allElements[index].tagName)) {
      
      // If we find a list, it contains our choices
      if (allElements[index].tagName === 'UL') {
        startChoices = parseChoices(allElements[index]);
      } else {
        // Otherwise it's part of the content
        startContent += allElements[index].outerHTML;
      }
      
      index++;
    }
    
    // Save the start node
    nodes['start'] = {
      content: startContent,
      choices: startChoices
    };
    
    // Now process each heading and its content as a node
    let currentNodeId = '';
    let currentNodeContent = '';
    let currentNodeChoices = [];
    
    for (let i = index; i < allElements.length; i++) {
      const element = allElements[i];
      
      // If we hit a heading, it's the start of a new node
      if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(element.tagName)) {
        // Save the previous node if we have one
        if (currentNodeId) {
          nodes[currentNodeId] = {
            content: currentNodeContent,
            choices: currentNodeChoices
          };
        }
        
        // Start a new node
        // Generate ID in the same way GitHub does (lowercase, replace spaces with hyphens, remove non-alphanumeric)
        const headingText = element.textContent;
        currentNodeId = githubSlugify(headingText);
        
        currentNodeContent = element.outerHTML;
        currentNodeChoices = [];
      } 
      // If we find a list, it contains our choices for the current node
      else if (element.tagName === 'UL') {
        currentNodeChoices = parseChoices(element);
      } 
      // Otherwise it's content for the current node
      else {
        currentNodeContent += element.outerHTML;
      }
    }
    
    // Save the last node
    if (currentNodeId) {
      nodes[currentNodeId] = {
        content: currentNodeContent,
        choices: currentNodeChoices
      };
    }
    
    return nodes;
  }
  
  /**
   * Convert a string into a GitHub-style slug ID
   * This mimics how GitHub generates IDs for markdown headings
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
   * Parse a UL element into an array of choice objects
   */
  function parseChoices(ulElement) {
    const choices = [];
    const listItems = ulElement.getElementsByTagName('li');
    
    for (let i = 0; i < listItems.length; i++) {
      const text = listItems[i].textContent;
      
      // Look for the ">" separator instead of ":"
      const parts = text.split('>');
      
      if (parts.length >= 2) {
        const choiceText = parts[0].trim();
        const targetHeadingText = parts[1].trim();
        
        // Generate the target ID using the same GitHub-style slugification
        const targetId = githubSlugify(targetHeadingText);
        
        choices.push({
          text: choiceText,
          target: targetId
        });
      }
    }
    
    return choices;
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
  
  // Replace the original document content with our game container
  document.body.innerHTML = '';
  document.body.appendChild(contentContainer);
});
