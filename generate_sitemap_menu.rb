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

# Generate ID from URL
def url_to_id(url)
  'menu' + url.gsub('/', '-').sub(/-$/, '')
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
  
  if header['children'].empty?
    # Leaf node - use p.listitem
    html += "#{indent}<p class=\"listitem\"><a href=\"#{page_url}##{header['anchor']}\"><strong>#{header['text']}</strong></a></p>\n"
  else
    # Has children - use details/summary
    html += "#{indent}<details>\n"
    html += "#{indent}  <summary><a href=\"#{page_url}##{header['anchor']}\"><strong>#{header['text']}</strong></a></summary>\n"
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
  
  if !has_children && !has_headers
    # Leaf node - no children, no headers - use p.listitem
    html += "#{indent}<p class=\"listitem\"><a href=\"#{node['url']}\">#{node['title']}</a></p>\n"
  else
    # Has children or headers - use details/summary
    page_id = url_to_id(node['tocpath'] || node['url'])
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

# Write to file
File.write('_includes/sitemap_menu.html', menu_html)
puts "Generated sitemap menu"
