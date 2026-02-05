#!/usr/bin/env ruby
require 'json'
require 'yaml'

# Parse markdown headers
def extract_headers(content)
  headers = []
  
  content.each_line do |line|
    # Match markdown headers (# through ######)
    if line =~ /^(#+)\s+(.+)$/
      level = $1.length
      text = $2.strip
      
      # Check for custom ID in format {#custom-id}
      custom_id = nil
      if text =~ /\{#([a-zA-Z0-9_-]+)\}\s*$/
        custom_id = $1
        # Remove the {#custom-id} part from the text
        text = text.sub(/\s*\{#[a-zA-Z0-9_-]+\}\s*$/, '').strip
      end
      
      # Use custom ID if provided, otherwise generate GitHub-style anchor
      anchor = custom_id || text.downcase
        .gsub(/[^\w\s-]/, '')
        .gsub(/\s+/, '-')
        .gsub(/-+/, '-')
        .gsub(/^-|-$/, '')
      
      headers << {
        'level' => level,
        'text' => text,
        'anchor' => anchor
      }
    end
  end
  headers
end



# Build hierarchical structure from flat list
def build_hierarchy(pages)
  root = {
    'title' => 'Root',
    'url' => '/',
    'headers' => [],
    'children' => {}
  }
  
  pages.each do |page|
    # Split URL into segments
    segments = page['url'].split('/').reject(&:empty?)
    
    # Navigate/create the hierarchy
    current = root
    segments.each_with_index do |segment, index|
      current['children'] ||= {}
      
      if index == segments.length - 1
        # Last segment - this is the page itself
        current['children'][segment] = {
          'title' => page['title'],
          'url' => page['url'],
          'headers' => page['headers'],
          'children' => {}
        }
      else
        # Intermediate segment - create if needed
        current['children'][segment] ||= {
          'title' => segment.split('-').map(&:capitalize).join(' '),
          'url' => '/' + segments[0..index].join('/') + '/',
          'headers' => [],
          'children' => {}
        }
        current = current['children'][segment]
      end
    end
  end
  
  # Handle root index page
  root_page = pages.find { |p| p['url'] == '/' || p['url'] == '/index.html' }
  if root_page
    root['title'] = root_page['title']
    root['headers'] = root_page['headers']
  end
  
  root
end

# Main processing
def generate_site_structure
  pages = []
  
  # Find all markdown and HTML files
  Dir.glob('**/*.{md,markdown,html}').each do |file|
    # Skip files in certain directories
    next if file.start_with?('_site/', '_data/', '_includes/', 'vendor/', 'node_modules/')
    
    content = File.read(file)
    
    # Extract front matter
    if content =~ /\A(---\s*\n.*?\n?)^((---|\.\.\.)\s*$\n?)/m
      front_matter = YAML.load($1)
      body = content[$1.length + $2.length..-1]
    else
      front_matter = {}
      body = content
    end
    
    # Skip if excluded
    next if front_matter['exclude_from_sitemap']
    
    # Determine URL
    url = file.sub(/\.(md|markdown|html)$/, '')
    url = '/' + url unless url.start_with?('/')
    url += '/' unless url.end_with?('/') || url.end_with?('.html')
    url.gsub!('/index/', '/')
    
    # Get title
    title = front_matter['title'] || front_matter['name'] || File.basename(file, '.*').split('-').map(&:capitalize).join(' ')
    
    # Extract headers
    headers = extract_headers(body)
    
    pages << {
      'url' => url,
      'title' => title,
      'headers' => headers,
      'file' => file
    }
  end
  
  # Build hierarchy
  hierarchy = build_hierarchy(pages)
  
  # Also create a flat sorted list for simpler use cases
  flat_list = pages.sort_by { |p| p['url'] }
  
  # Output both structures
  output = {
    'hierarchy' => hierarchy,
    'flat' => flat_list
  }
  
  # Ensure _data directory exists
  Dir.mkdir('_data') unless Dir.exist?('_data')
  
  # Write to file
  File.write('_data/site_structure.json', JSON.pretty_generate(output))
  
  puts "Generated _data/site_structure.json with #{pages.length} pages"
end

# Run it
generate_site_structure
