---
title: Topic Index
permalink: /quran/topics/
---

{% comment %} Build dictionary of topics {% endcomment %}
{% assign topics_hash = "" | split: "" %}
{% comment %} Loop through all pages {% endcomment %}
{% for page in site.pages %}
 {% if page.path contains 'quran/' %}
 {% assign spans = page.content | split: '<span id="v' %}
 {% for span in spans %}
 {% if span contains 'data-tags=' %}
{% comment %} Extract data-verse {% endcomment %}
 {% assign verse_start = span | split: 'data-verse="' | last %}
 {% assign verse_ref = verse_start | split: '"' | first %}
{% comment %} Extract data-tags {% endcomment %}
{% assign tags_start = span | split: 'data-tags="' | last %}
 {% assign tags_string = tags_start | split: '"' | first %}
 {% if tags_string != "" %}
 tags string {{ tags_string }}
 {% assign tags = tags_string | split: ',' %}
{% for tag in tags %}
 {% assign tag = tag | strip %}
{% comment %} Format verse ref as chapter/verse {% endcomment %}
 {% assign ref_parts = verse_ref | split: ':' %}
 {% assign chapter = ref_parts[0] %}
 {% assign verse = ref_parts[1] %}
{% comment %} Pad chapter with zeros {% endcomment %}
 {% if chapter.size == 1 %}
 {% assign chapter_padded = '00' | append: chapter %}
 {% elsif chapter.size == 2 %}
 {% assign chapter_padded = '0' | append: chapter %}
 {% else %}
 {% assign chapter_padded = chapter %}
 {% endif %}
{% assign link = chapter_padded | append: '/#v' | append: verse %}
 {% assign entry = tag | append: '¿' | append: link | append: '¿' | append: chapter | append: ':' | append: verse %}
 {% assign topics_hash = topics_hash | push: entry %}
{% endfor %}
{% endif %}
{% endif %}
{% endfor %}
{% endif %}
{% endfor %}
{% comment %} Sort and group by tag {% endcomment %}
{% assign topics_hash = topics_hash | sort %}
{% assign current_tag = "" %}
{% for entry in topics_hash %}
{% assign parts = entry | split: '¿' %}
{% assign tag = parts[0] %}
{% assign link = parts[1] %}
{% assign display = parts[2] %}
{% if tag != current_tag %}
{% if current_tag != "" %}</ul>{% endif %}
<h2>{{ tag | capitalize }}</h2>
<ul>
{% assign current_tag = tag %}
{% endif %}
<li><a href="{{ link }}">{{ display }}</a></li>
{% endfor %}
</ul>
