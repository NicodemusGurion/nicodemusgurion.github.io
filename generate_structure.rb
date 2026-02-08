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
    'children' => {},
    'include_in_menu' => false
  }
  
  pages.each do |page|
    # Use tocpath if defined, otherwise use the actual URL for hierarchy
    path_for_structure = page['tocpath'] || page['url']
    
    # Normalize: remove trailing slash for splitting (except root "/")
    path_for_structure = path_for_structure.chomp('/') unless path_for_structure == '/'
    
    # Split path into segments, removing empty strings
    segments = path_for_structure.split('/').reject(&:empty?)
    
    # Skip root page, handle it separately
    next if segments.empty?
    
    # Navigate/create the hierarchy
    current = root
    segments.each_with_index do |segment, index|
      current['children'] ||= {}
      
      if index == segments.length - 1
        # Last segment - this is the actual page
        # Check if this node already exists (from an index page)
        if current['children'][segment]
          # Node exists - update it with page data
          current['children'][segment]['title'] = page['title']
          current['children'][segment]['url'] = page['url']
          current['children'][segment]['headers'] = page['headers']
          current['children'][segment]['include_in_menu'] = page['include_in_menu']
        else
          # Create new node
          current['children'][segment] = {
            'title' => page['title'],
            'url' => page['url'],
            'headers' => page['headers'],
            'children' => {},
            'include_in_menu' => page['include_in_menu']
          }
        end
      else
        # Intermediate segment - ensure node exists
        unless current['children'][segment]
          # Create placeholder node
          current['children'][segment] = {
            'title' => segment.split('-').map(&:capitalize).join(' '),
            'url' => '/' + segments[0..index].join('/') + '/',
            'headers' => [],
            'children' => {},
            'include_in_menu' => false
          }
        end
        current = current['children'][segment]
      end
    end
  end
  
  # Handle root index page
  root_page = pages.find { |p| p['url'] == '/' }
  if root_page
    root['title'] = root_page['title']
    root['headers'] = root_page['headers']
    root['include_in_menu'] = root_page['include_in_menu']
  end
  
  root
end


# Main processing
def generate_site_structure
  pages = []
  
  # Find all markdown and HTML files
  Dir.glob('**/*.{md,markdown,html}').each do |file|
    # Skip files in certain directories
    next if file.start_with?('_site/', '_data/', '_includes/', '_layouts/', 'vendor/', 'node_modules/')
    
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
    
    # Use permalink if specified, otherwise generate from file path matching Jekyll's logic
    if front_matter['permalink']
      url = front_matter['permalink']
      # Ensure it starts with /
      url = '/' + url unless url.start_with?('/')
    else
      # Generate URL from file path, matching Jekyll's defaults
      url = file.sub(/\.(md|markdown|html)$/, '')
      url = '/' + url unless url.start_with?('/')
      
      # Remove /index from the end (index.md becomes just the directory)
      url = url.sub(/\/index$/, '/')
      
      # For non-index files, remove trailing slash that we might have added
      # unless it's a directory-style URL
      unless url.end_with?('/')
        # Check if original file was index - if not, no trailing slash
        url = url # already correct
      end
    end

    
    # Get tocpath if specified (for hierarchical organization)
    tocpath = front_matter['tocpath']
    
        # Get title
    title = front_matter['title'] || front_matter['name'] || File.basename(file, '.*').split('-').map(&:capitalize).join(' ')
    
    # Check if page should be in menu
    include_in_menu = front_matter['menu'] == true
    
    # Extract headers
    headers = extract_headers(body)
    
    pages << {
      'url' => url,
      'tocpath' => tocpath,
      'title' => title,
      'headers' => headers,
      'file' => file,
      'include_in_menu' => include_in_menu
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
