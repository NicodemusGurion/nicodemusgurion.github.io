#!/usr/bin/env ruby
require 'json'

# Recursively build the sitemap HTML
def build_menu_html(node, indent_level = 0)
  return '' if node.nil?
  
  html = ''
  indent = '  ' * indent_level
  
  children = node['children'] || {}
  headers = node['headers'] || []
  has_children = !children.empty?
  has_headers = !headers.empty?
  
  # If this node has children or headers, wrap in details
  if has_children || has_headers
    html << "#{indent}<li>\n"
    html << "#{indent}  <details>\n"
    html << "#{indent}    <summary><a href=\"#{node['url']}\">#{node['title']}</a></summary>\n"
    html << "#{indent}    <ul>\n"
    
    # Add headers first
    headers.each do |header|
      html << "#{indent}      <li><a href=\"#{node['url']}##{header['anchor']}\">#{header['text']}</a></li>\n"
    end
    
    # Then add child pages
    children.keys.sort.each do |child_key|
      child = children[child_key]
      html << build_menu_html(child, indent_level + 3)
    end
    
    html << "#{indent}    </ul>\n"
    html << "#{indent}  </details>\n"
    html << "#{indent}</li>\n"
  else
    # Just a simple link with no children or headers
    html << "#{indent}<li><a href=\"#{node['url']}\">#{node['title']}</a></li>\n"
  end
  
  html
end

# Main processing
def generate_sitemap_menu
  # Read the site structure
  structure_file = '_data/site_structure.json'
  
  unless File.exist?(structure_file)
    puts "Error: #{structure_file} not found. Run generate_structure.rb first."
    exit 1
  end
  
  data = JSON.parse(File.read(structure_file))
  hierarchy = data['hierarchy']
  
  # Start building HTML
  html = <<~HTML
    <!-- Auto-generated sitemap menu - DO NOT EDIT MANUALLY -->
    <!-- Generated: #{Time.now.utc.iso8601} -->
    <nav class="sitemap-menu">
      <ul>
  HTML
  
  # Add root page if it exists and has meaningful content
  if hierarchy['url'] && hierarchy['url'] != '/'
    html << "    <li><a href=\"#{hierarchy['url']}\">#{hierarchy['title']}</a></li>\n"
  end
  
  # Build menu from children
  children = hierarchy['children'] || {}
  children.keys.sort.each do |child_key|
    child = children[child_key]
    html << build_menu_html(child, 2)
  end
  
  html << <<~HTML
      </ul>
    </nav>
  HTML
  
  # Ensure _includes directory exists
  Dir.mkdir('_includes') unless Dir.exist?('_includes')
  
  # Write to file
  output_file = '_includes/sitemap_menu.html'
  File.write(output_file, html)
  
  puts "Generated #{output_file}"
end

# Run it
generate_sitemap_menu
