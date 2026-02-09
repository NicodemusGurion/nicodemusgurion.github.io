#!/usr/bin/env ruby
require 'json'

# Read the site structure
data = JSON.parse(File.read('_data/site_structure.json'))

# Generate HTML for a node and its children recursively
def generate_html(node, level = 0)
  html = ""
  
  # Generate link for this node (skip root)
  if node['url'] != '/'
    indent = "  " * level
    
    # Check if children should be excluded
    should_show_children = !node['exclude_children'] && node['children'] && node['children'].length > 0
    has_headers = node['headers'] && node['headers'].length > 0
    
    #html += "#{indent}<li>\n"
    
    # If there are children or headers, wrap in details/summary
    if should_show_children || has_headers
      html += "#{indent}  <details>\n"
      html += "#{indent}    <summary><a href=\"#{node['url']}\">#{node['title']}</a></summary>\n"
      
      # Add headers if present
      if has_headers
        #html += "#{indent}    <ul class=\"headers\">\n"
        node['headers'].each do |header|
          html += "#{indent}      <p class=\"listitem sitemap-headers\"><a href=\"#{node['url']}##{header['anchor']}\">#{header['text']}</a></p>\n"
        end
        #html += "#{indent}    </ul>\n"
      end
      
      # Add children if present and not excluded
      if should_show_children
        #html += "#{indent}    <ul>\n"
        node['children'].sort.each do |key, child|
          html += generate_html(child, level + 3)
        end
        #html += "#{indent}    </ul>\n"
      end
      
      html += "#{indent}  </details>\n"
    else
      # Just a simple link
      html += "#{indent}  <p class=\"listitem\"><a href=\"#{node['url']}\">#{node['title']}</a></p>\n"
    end
    
    #html += "#{indent}</li>\n"
  else
    # For root, just process children
    if node['children'] && node['children'].length > 0
      node['children'].sort.each do |key, child|
        html += generate_html(child, level)
      end
    end
  end
  
  html
end

# Generate the complete menu
menu_html = "<nav class=\"sitemap-menu\">\n"
menu_html += "  <ul>\n"
menu_html += generate_html(data['hierarchy'], 1)
menu_html += "  </ul>\n"
menu_html += "</nav>\n"

# Write to file
File.write('_includes/sitemap_menu.html', menu_html)
puts "Generated sitemap menu with #{data['flat'].length} pages"
