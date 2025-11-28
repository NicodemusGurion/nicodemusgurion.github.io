---
title: Topic Index
permalink: /quran/topics/
---

<style>
/* Hide <tags> elements by default (before JavaScript runs) */
tags {
display: none;
}

/* Style for topic tag links after JavaScript conversion */
.topic-links {
font-size: 0.85em;
color: #666;
margin-left: 0.5em;
}

.topic-tag {
background: #e8f4f8;
padding: 2px 8px;
border-radius: 3px;
text-decoration: none;
color: #2c5aa0;
margin: 0 3px;
display: inline-block;
transition: background 0.2s;
}

.topic-tag:hover {
background: #d0e7f0;
text-decoration: underline;
}

/* Optional: Style for the topic index page */
.topic-index h2 {
margin-top: 2em;
border-bottom: 2px solid #e0e0e0;
padding-bottom: 0.3em;
}

.topic-index ul {
list-style: none;
padding-left: 0;
}

.topic-index li {
margin: 0.5em 0;
padding-left: 1em;
}

.topic-index li:before {
content: “→ “;
margin-right: 0.5em;
color: #999;
}
</style>

{% comment %} Build array of all topic entries {% endcomment %}
{% assign all_entries = “” | split: “” %}

{% comment %} Loop through all pages {% endcomment %}
{% for page in site.pages %}
{% if page.url contains "/quran/0" or page.url contains "/quran/1" %}
{% comment %} Split by tags to find all tag markers {% endcomment %}
{% assign tag_markers = page.content | split: "<tags " %}
{% for marker in tag_markers offset:1 %}
  {% comment %} Extract content between <tags and /> {% endcomment %}
  {% assign tag_content = marker | split: "/>" | first | strip %}
Tag content {{ tag_content }}
  {% comment %} Split by = to get ref and tags {% endcomment %}
  {% assign parts = tag_content | split: "=" %}
  {% if parts.size == 2 %}
    {% assign ref = parts[0] | strip %}
    {% assign tags_string = parts[1] | strip %}
    
    {% comment %} Split the verse reference (e.g., "1:5") {% endcomment %}
    {% assign ref_parts = ref | split: ":"%}
    {% assign chapter = ref_parts[0] %}
    {% assign verse = ref_parts[1] %}
    
    {% comment %} Pad chapter with zeros (001, 002, etc.) {% endcomment %}
    {% if chapter.size == 1 %}
      {% assign chapter_padded = "00" | append: chapter %}
    {% elsif chapter.size == 2 %}
      {% assign chapter_padded = "0" | append: chapter %}
    {% else %}
      {% assign chapter_padded = chapter %}
    {% endif %}
Chapter verse {{ chapter_padded }} {{ verse }}
    {% comment %} Create the link (e.g., "001/#v5") {% endcomment %}
    {% assign link = chapter_padded | append: "/#v" | append: verse %}
    Link url {{ link }}
    {% comment %} Split tags by comma {% endcomment %}
    {% assign tags = tags_string | split: "," %}
Number of tags {{ tags.size }}
    {% for tag in tags %}
      {% assign tag_name = tag | strip | downcase %}
Tag name {{tag_name }}
      {% comment %} Create entry: tag|||link|||display (using ||| as delimiter) {% endcomment %}
      {% assign display = chapter | append: ":" | append: verse %}
      {% assign entry = tag_name | append: "|||" | append: link | append: "|||" | append: display %}
      {% assign all_entries = all_entries | push: entry %}
    {% endfor %}
  {% endif %}
{% endfor %}

{% endif %}
{% endfor %}

{% comment %} Sort entries alphabetically by tag name {% endcomment %}
{% assign sorted_entries = all_entries | sort %}

{% if sorted_entries.size == 0 %}

<p>No topics found. Add tags using: <code>&lt;tags 1:5=prayer,guidance /&gt;</code></p>
{% else %}

{% assign current_tag = “” %}

{% for entry in sorted_entries %}
{% assign parts = entry | split: ‘|||’ %}
{% assign tag_name = parts[0] %}
{% assign link = parts[1] %}
{% assign display = parts[2] %}

{% comment %} Start new section when tag changes {% endcomment %}
{% if tag_name != current_tag %}
{% if current_tag != “” %}
</ul>
{% endif %}

```
<h2 id="{{ tag_name }}">{{ tag_name | capitalize }}</h2>
<ul>
{% assign current_tag = tag_name %}
```

{% endif %}

  <li><a href="{{ link }}">Chapter {{ display }}</a></li>
{% endfor %}

</ul>

{% endif %}