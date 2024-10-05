module Jekyll
  module QuranLinkFilter
    # Custom Liquid filter to convert Quran references to Quran.com links
    def link_quran_references(input)
      # Define a regex pattern to capture Quran references like "2:255"
      input.gsub(/Surah (\d{1,3}):(\d{1,3})\b/) do |match|
        surah = Regexp.last_match(1)
        ayah = Regexp.last_match(2)
        # Generate a link to the Quran.com page for this verse
        "<a href='https://quran.com/#{surah}/#{ayah}' target='_blank'>#{match}</a>"
      end
    end
  end
end

Liquid::Template.register_filter(Jekyll::QuranLinkFilter)