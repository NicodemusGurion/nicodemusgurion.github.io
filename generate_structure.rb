#!/usr/bin/env ruby
require 'yaml'
require 'json'

# Parse front matter and content from a file
def parse_file(filepath)
  content = File.read(filepath)
  
  # Match front matter
  if content =~ /\A---\s*\n(.*?\n)---\s*\n(.*)/m
    front_matter = YAML.load($1) || {}
    body = $2
  else
    front_matter = {}
    body = content
  end
  
  [front_matter, body]
end

# Extract headers from markdown content
def extract_headers(content)
  headers = []
  content.scan(/^(#+)\s+(.+?)(?:\s+\{#([a-z0-9\-]+)\})?$/) do |match|
    level = match[0].length
    text = match[1].strip
    custom_id = match[2]
    
    # Generate GitHub-style anchor if no custom ID
    if custom_id
      anchor = custom_id
    else
      anchor = text.downcase
                   .gsub(/[^\w\s-]/, '')
                   .gsub(/\s+/, '-')
    end
    
    headers << {
      'level' => level,
      'text' => text,
      'anchor' => anchor
    }
  end
  headers
end

# Scan all markdown and HTML files
pages = []
Dir.glob('**/*.{md,markdown,html}').each do |file|
  # Skip files in certain directories
  next if file.start_with?('_site/', 'vendor/', '.bundle/', 'node_modules/')
  
  front_matter, body = parse_file(file)
  
  # Skip if explicitly excluded from navigation
  next if front_matter['exclude_from_nav']
  
  # Extract headers
  headers = extract_headers(body)
  
  # Determine URL
  if front_matter['permalink']
    url = front_matter['permalink']
    url = '/' + url unless url.start_with?('/')
    url = url.chomp('/') unless url == '/'
  else
    url = file.sub(/\.(md|markdown|html)$/, '')
    url = '/' + url unless url.start_with?('/')
    if url.end_with?('/index')
      url = url.sub(/\/index$/, '/')
    else
      url = url.chomp('/')
    end
  end
  
  pages << {
    'url' => url,
    'tocpath' => front_matter['tocpath'],
    'title' => front_matter['title'] || 'Untitled',
    'headers' => headers,
    'file' => file,
    'include_in_menu' => front_matter['menu'] == true,
    'exclude_children' => front_matter['exclude_children'] == true
  }
end

# Sort pages by URL for consistency
pages.sort_by! { |p| p['url'] }

# Build hierarchical structure from flat list
def build_hierarchy(pages)
  root = {
    'title' => 'Root',
    'url' => '/',
    'headers' => [],
    'children' => {},
    'include_in_menu' => false,
    'exclude_children' => false
  }
  
  pages.each do |page|
    path_for_structure = page['tocpath'] || page['url']
    path_for_structure = path_for_structure.chomp('/') unless path_for_structure == '/'
    segments = path_for_structure.split('/').reject(&:empty?)
    
    next if segments.empty?
    
    current = root
    segments.each_with_index do |segment, index|
      current['children'] ||= {}
      
      if index == segments.length - 1
        if current['children'][segment]
          current['children'][segment]['title'] = page['title']
          current['children'][segment]['url'] = page['url']
          current['children'][segment]['headers'] = page['headers']
          current['children'][segment]['include_in_menu'] = page['include_in_menu']
          current['children'][segment]['exclude_children'] = page['exclude_children']
        else
          current['children'][segment] = {
            'title' => page['title'],
            'url' => page['url'],
            'headers' => page['headers'],
            'children' => {},
            'include_in_menu' => page['include_in_menu'],
            'exclude_children' => page['exclude_children']
          }
        end
      else
        unless current['children'][segment]
          current['children'][segment] = {
            'title' => segment.split('-').map(&:capitalize).join(' '),
            'url' => '/' + segments[0..index].join('/') + '/',
            'headers' => [],
            'children' => {},
            'include_in_menu' => false,
            'exclude_children' => false
          }
        end
        current = current['children'][segment]
      end
    end
  end
  
  root_page = pages.find { |p| p['url'] == '/' }
  if root_page
    root['title'] = root_page['title']
    root['headers'] = root_page['headers']
    root['include_in_menu'] = root_page['include_in_menu']
    root['exclude_children'] = root_page['exclude_children']
  end
  
  root
end

hierarchy = build_hierarchy(pages)

# Output JSON
output = {
  'hierarchy' => hierarchy,
  'flat' => pages
}

File.write('_data/site_structure.json', JSON.pretty_generate(output))
puts "Generated structure with #{pages.length} pages"
