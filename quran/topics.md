---
layout: default
title: Topic Index
permalink: /quran/topics/
---

<style>
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
.topic-links {
  font-size: 0.85em;
  color: #666;
  margin-left: 0.5em;
}
</style>

Version 0

{% comment %} Build array of all topic entries {% endcomment %}
{% assign all_entries = “” | split: “” %}

{% comment %} Loop through all pages {% endcomment %}
{% for page in site.pages %}
{% if page.layout == "surah" %}
{% comment %} Split by (( to find all tag markers {% endcomment %}
{% assign tag_markers = page.content | split: '((' %}
{% for marker in tag_markers offset:1 %}
  {% comment %} Extract content between (( and )) {% endcomment %}
  {% assign tag_content = marker | split: '))' | first | strip %}
Tag content: {{ tag_content }}
  {% assign parts = tag_content | split: ',' %}
  
  {% if parts.size >= 2 %}
    {% assign ref = parts[0] | strip %}
Reference: {{ ref }}
    {% assign ref_parts = ref | split: ':' %}
    {% if ref_parts.size == 2 %}
      {% assign chapter = ref_parts[0] %}
      {% assign verse = ref_parts[1] %}
      
      {% comment %} Pad chapter with zeros (001, 002, etc.) {% endcomment %}
      {% if chapter.size == 1 %}
        {% assign chapter_padded = '00' | append: chapter %}
      {% elsif chapter.size == 2 %}
        {% assign chapter_padded = '0' | append: chapter %}
      {% else %}
        {% assign chapter_padded = chapter %}
      {% endif %}
      
      {% comment %} Create the link (e.g., "001.html#v5") {% endcomment %}
      {% assign link = chapter_padded | append: '/#v' | append: verse %}
link url: {{ link }}
      {% comment %} Split tags by comma {% endcomment %}
      
      {% for tag in parts offset:1 %}
        {% assign tag_name = tag | strip | downcase %}
Tag name: {{tag_name}}
        {% comment %} Create entry: tag|||link|||display (using ||| as delimiter) {% endcomment %}
        {% assign display = chapter | append: ':' | append: verse %}
        
Display: {{display}}
        {% assign entry = tag_name | append: '|||' | append: link | append: '|||' | append: display %}
        {% assign all_entries = all_entries | push: entry %}
      {% endfor %}
    {% endif %}
  {% endif %}
{% endfor %}
{% endif %}
{% endfor %}

{% comment %} Sort entries alphabetically by tag name {% endcomment %}
{% assign sorted_entries = all_entries | sort %}

<h1>Topic Index</h1>

{% if sorted_entries.size == 0 %}

<p>No topics found. Add tags using: <code>((1:5,prayer,guidance))</code></p>
{% else %}

{% assign current_tag = “” %}

{% for entry in sorted_entries %}
Entry: {{ entry }}
{% assign parts = entry | split: ‘|||’ %}
{% assign tag_name = parts[0] %}
{% assign link = parts[1] %}
{% assign display = parts[2] %}

{% comment %} Start new section when tag changes {% endcomment %}
{% if tag_name != current_tag %}
{% if current_tag != “” %}
</ul>
{% endif %}
<h2 id="{{ tag_name }}">{{ tag_name | capitalize }}</h2>
<ul>
{% assign current_tag = tag_name %}
{% endif %}
<li><a href="{{ link }}">{{ display }}</a></li>
{% endfor %}
</ul>
{% endif %}