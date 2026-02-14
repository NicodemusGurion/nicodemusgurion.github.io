#!/usr/bin/env ruby
require 'json'

# Read the site structure
data = JSON.parse(File.read('_data/site_structure.json'))
pages = data['pages']

# Build a tree structure from pages
def build_tree(pages)
  root = { 'url' => '/', 'children' => {} }
  
  pages.each do |page|
    path = page['tocpath'] || page['url']
    path = path.chomp('/') unless path == '/'
    segments = path.split('/').reject(&:empty?)
    
    current = root
    segments.each_with_index do |segment, index|
      current['children'] ||= {}
      
      unless current['children'][segment]
        current['children'][segment] = {
          'segment' => segment,
          'children' => {}
        }
      end
      
      if index == segments.length - 1
        # This is the actual page
        current['children'][segment].merge!(page)
      end
      
      current = current['children'][segment]
    end
  end
  
  # Add root page data
  root_page = pages.find { |p| p['url'] == '/' }
  root.merge!(root_page) if root_page
  
  root
end

# Generate ID from URL and optional anchor
def url_to_id(url, anchor = nil)
  id = 'menu' + url.gsub('/', '-').sub(/-$/, '')
  id += '-' + anchor if anchor
  id
end

# Build header tree with parent-child relationships
def build_header_tree(headers)
  return [] if headers.empty?
  
  result = []
  stack = []
  
  headers.each do |header|
    node = header.dup
    node['children'] = []
    
    # Pop stack until we find a parent with lower level
    while stack.any? && stack.last['level'] >= header['level']
      stack.pop
    end
    
    if stack.empty?
      # Top level header
      result << node
    else
      # Child of previous header
      stack.last['children'] << node
    end
    
    stack << node
  end
  
  result
end

# Generate HTML for headers recursively
def generate_header_html(header, page_url, indent_level)
  html = ""
  indent = "  " * indent_level
  
  header_id = url_to_id(page_url, header['anchor'])
  
  if header['children'].empty?
    # Leaf node - use p.listitem
    html += "#{indent}<p class=\"listitem\" id=\"#{header_id}\"><a href=\"#{page_url}##{header['anchor']}\">#{header['text']}</a></p>\n"
  else
    # Has children - use details/summary
    html += "#{indent}<details id=\"#{header_id}\">\n"
    html += "#{indent}  <summary><a href=\"#{page_url}##{header['anchor']}\">#{header['text']}</a></summary>\n"
    header['children'].each do |child|
      html += generate_header_html(child, page_url, indent_level + 1)
    end
    html += "#{indent}</details>\n"
  end
  
  html
end

# Generate HTML for a page node recursively
def generate_page_html(node, level = 0)
  return "" if node['url'].nil? # Skip nodes without pages
  return "" if node['exclude_from_nav'] # Skip excluded pages
  
  html = ""
  indent = "  " * level
  
  has_children = node['children'] && node['children'].any? { |k, v| v['url'] && !v['exclude_from_nav'] }
  has_headers = node['headers'] && node['headers'].any?
  
  # Don't show children if exclude_children is set
  has_children = false if node['exclude_children']
  
  page_id = url_to_id(node['url'])
  
  if !has_children && !has_headers
    # Leaf node - no children, no headers - use p.listitem
    html += "#{indent}<p class=\"listitem\" id=\"#{page_id}\"><a href=\"#{node['url']}\">#{node['title']}</a></p>\n"
  else
    # Has children or headers - use details/summary
    html += "#{indent}<details id=\"#{page_id}\">\n"
    html += "#{indent}  <summary><a href=\"#{node['url']}\">#{node['title']}</a></summary>\n"
    
    # Add headers if present
    if has_headers
      header_tree = build_header_tree(node['headers'])
      header_tree.each do |header|
        html += generate_header_html(header, node['url'], level + 1)
      end
    end
    
    # Add child pages if present
    if has_children
      node['children'].sort.each do |key, child|
        html += generate_page_html(child, level + 1)
      end
    end
    
    html += "#{indent}</details>\n"
  end
  
  html
end

# Build the tree and generate HTML
tree = build_tree(pages)

menu_html = "<nav class=\"sitemap-menu\">\n"

# Process root's children
if tree['children']
  tree['children'].sort.each do |key, child|
    menu_html += generate_page_html(child, 1)
  end
end

menu_html += "</nav>\n"

# Add dynamic JavaScript
menu_html += <<~JAVASCRIPT
<style>
  .sitemap-menu .current-page > summary > a,
  .sitemap-menu .current-page > a {
    text-decoration: underline;
    font-weight: bold;
  }
</style>

<script>
(function() {
  function updateMenuState() {
    // Get current URL and hash
    var currentPath = window.location.pathname;
    var currentHash = window.location.hash.slice(1); // Remove the #
    
    // Remove trailing slash unless it's root
    if (currentPath !== '/' && currentPath.endsWith('/')) {
      currentPath = currentPath.slice(0, -1);
    }
    
    // Build the menu ID
    var menuId = 'menu' + currentPath.replace(/\\//g, '-');
    if (currentHash) {
      menuId += '-' + currentHash;
    }
    
    // Remove previous current-page highlights
    var previousCurrent = document.querySelectorAll('.sitemap-menu .current-page');
    previousCurrent.forEach(function(el) {
      el.classList.remove('current-page');
    });
    
    // Find and highlight the current element
    var currentElement = document.getElementById(menuId);
    if (currentElement) {
      currentElement.classList.add('current-page');
      
      // Open all parent details elements
      var parent = currentElement.parentElement;
      while (parent) {
        if (parent.tagName === 'DETAILS') {
          parent.setAttribute('open', '');
        }
        parent = parent.parentElement;
      }
      
      // Scroll into view (optional)
      // currentElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }
  
  // Update on page load
  updateMenuState();
  
  // Update when hash changes (user clicks anchor links)
  window.addEventListener('hashchange', updateMenuState);
  
  // Also listen to clicks on the page TOC
  document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.hash) {
      // Small delay to let the hash change
      setTimeout(updateMenuState, 10);
    }
  });
})();
</script>
JAVASCRIPT

# Write to file
File.write('_includes/sitemap_menu.html', menu_html)
puts "Generated sitemap menu"
