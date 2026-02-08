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
    html += "#{indent}<li>\n"
    html += "#{indent}  <a href=\"#{node['url']}\">#{node['title']}</a>\n"
    
    # Add headers if present
    if node['headers'] && node['headers'].length > 0
      html += "#{indent}  <ul class=\"headers\">\n"
      node['headers'].each do |header|
        html += "#{indent}    <li><a href=\"#{node['url']}##{header['anchor']}\"><strong>#{header['text']}</strong></a></li>\n"
      end
      html += "#{indent}  </ul>\n"
    end
    
    # Add children if present
    if node['children'] && node['children'].length > 0
      html += "#{indent}  <ul>\n"
      node['children'].sort.each do |key, child|
        html += generate_html(child, level + 2)
      end
      html += "#{indent}  </ul>\n"
    end
    
    html += "#{indent}</li>\n"
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
