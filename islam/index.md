---
layout: page
title: Teachings of Islam
image: https://i.ibb.co/9H5GWT83/IMG-0248.jpg
toc: true
---

<h1>Table of Contents</h1>

{% comment %}
Generates a hierarchical list of child pages with their headers
Uses tocpath for hierarchy if available, otherwise uses url
Excludes the current page from the list
{% endcomment %}

{% assign current_path = page.url | remove: ‘index.html’ %}
{% assign child_pages = site.pages | where_exp: “p”, “p.url != page.url” %}

{% comment %} Filter for child pages {% endcomment %}
{% assign children = “” | split: “” %}
{% for p in child_pages %}
{% assign check_path = p.tocpath | default: p.url %}
{% if check_path contains current_path and check_path != current_path %}
{% assign children = children | push: p %}
{% endif %}
{% endfor %}

{% comment %} Sort by tocpath or url {% endcomment %}
{% assign sorted_children = children | sort_natural: “tocpath” %}

<ul>
{% for child in sorted_children %}
  <li>
    <a href="{{ child.url | relative_url }}">{{ child.title | default: child.url }}</a>

{% comment %} Extract headers from content {% endcomment %}
{% if child.content %}
  {% assign headers = child.content | split: '<h' %}
  {% assign has_headers = false %}
  
  {% comment %} Check if there are actual headers {% endcomment %}
  {% for header in headers %}
    {% if forloop.first == false %}
      {% assign has_headers = true %}
      {% break %}
    {% endif %}
  {% endfor %}
  
  {% if has_headers %}
    <ul>
    {% for header in headers %}
      {% if forloop.first == false %}
        {% assign level = header | slice: 0, 1 %}
        {% assign rest = header | split: '>' | first %}
        {% assign id_attr = rest | split: 'id="' | last | split: '"' | first %}
        {% assign header_text = header | split: '>' | slice: 1 | join: '>' | split: '</h' | first %}
        
        {% if id_attr and id_attr != rest %}
          <li>
            <a href="{{ child.url | relative_url }}#{{ id_attr }}">{{ header_text | strip_html }}</a>
          </li>
        {% endif %}
      {% endif %}
    {% endfor %}
    </ul>
  {% endif %}
{% endif %}

  </li>
{% endfor %}
</ul>