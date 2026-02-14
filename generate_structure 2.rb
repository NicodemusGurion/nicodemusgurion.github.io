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
  
  # Skip any file that has a path component starting with underscore or dot
  path_parts = file.split('/')
  next if path_parts.any? { |part| part.start_with?('_') || part.start_with?('.') }
  
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

# Output JSON (just flat data)
output = {
  'pages' => pages
}

File.write('_data/site_structure.json', JSON.pretty_generate(output))
puts "Generated structure with #{pages.length} pages"
