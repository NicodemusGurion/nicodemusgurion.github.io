---
layout: default
title: Table of Contents
---

<h1>Table of Contents</h1>

<ul>
  {% for page in site.pages %}
    {% if page.path contains 'islam/' and page.path endswith '.md' %}
      <li>
        <a href="{{ page.url }}">{{ page.title }}</a>
        <ul>
          {% assign content = page.content %}
          {% assign headings = content | split: "\n" %}
          {% for line in headings %}
            {% if line contains "# " %}
              {% assign header_level = line | replace: "# ", "" %}
              {% assign header_text = header_level | strip %}
              {% assign header_id = header_text | downcase | replace: " ", "-" %}
              <li>
                <a href="{{ page.url }}#{{ header_id }}">{{ header_text }}</a>
              </li>
            {% elsif line contains "## " %}
              {% assign header_level = line | replace: "## ", "" %}
              {% assign header_text = header_level | strip %}
              {% assign header_id = header_text | downcase | replace: " ", "-" %}
              <ul>
                <li>
                  <a href="{{ page.url }}#{{ header_id }}">{{ header_text }}</a>
                </li>
              </ul>
            {% endif %}
          {% endfor %}
        </ul>
      </li>
    {% endif %}
  {% endfor %}
</ul>