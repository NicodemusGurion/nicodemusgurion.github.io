---
layout: default
title: Table of Contents
---

<h1>Table of Contents</h1>

{% assign current_url = page.url %}

<ul>
  {% for pg in site.pages %}
    {% if pg.url contains 'islam/' %}
    {% if pg.url != page.url %}
      <li>
        <a href="{{ pg.url }}">{{ pg.title }}</a>
      </li>
    {% endif %}
    {% endif %}
  {% endfor %}
</ul>


{% capture content %}{% include_relative 02-Muhammad.md %}{% endcapture %}
{% assign content_html = content | markdownify %}

{% assign toc_start = '<ul id="markdown-toc">' %}
{% assign toc_end = '</ul>' %}
{% assign content_after_toc = content_html | split: toc_start | last %}

{% capture toc_content %}
  {{ toc_start }}
  {% assign ul_count = 1 %}
  {% assign remaining_content = content_after_toc %}
  {% assign closing_found = false %}
  
  {% capture inner_content %}
    {% for char in remaining_content | split: '' %}
      {% if char == '<' %}
        {% capture tag %}{{ remaining_content | slice: forloop.index, 4 }}{% endcapture %}
        {% if tag == 'ul>' %}
          {% increment ul_count %}
        {% elsif tag == '/ul>' %}
          {% decrement ul_count %}
          {% if ul_count == 0 %}
            {% assign closing_found = true %}
          {% endif %}
        {% endif %}
      {% endif %}
      
      {% unless closing_found %}
        {{ char }}
      {% else %}
        {% break %}
      {% endunless %}
      
    {% endfor %}
  {% endcapture %}
  
  {{ inner_content }}
  {{ toc_end }}
{% endcapture %}
{{ toc_content }}