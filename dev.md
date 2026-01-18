---
title: development
permalink: /dev/
layout: page
---

{% assign pages_sorted = site.pages | sort: "url" %}

{% for page in pages_sorted %}
  <details>
    <summary><a href="{{ page.url }}">{{ page.title }}</a></summary>

    {% comment %}
      Scan the Markdown content for headings
    {% endcomment %}
    {% for line in page.content | split: "\n" %}
      {% if line contains "#" %}
        {% assign heading_match = line | regex_match: "^(#+)\\s+(.*)" %}
        {% if heading_match %}
          {% assign level = heading_match[1] | size %}
          {% assign text = heading_match[2] %}

          {% comment %}
            Check for custom ID at the end: {#id}
          {% endcomment %}
          {% assign id_match = text | regex_match: "(.*)\\s*\\{#([a-zA-Z0-9-_]+)\\}$" %}
          {% if id_match %}
            {% assign text = id_match[1] | strip %}
            {% assign id = id_match[2] %}
          {% else %}
            {% assign id = text | downcase | replace: " ", "-" | replace_regex: "[^a-z0-9\\-]", "" %}
          {% endif %}

          <p style="margin-left:{{ level | minus:1 }}em">
            <a href="{{ page.url }}#{{ id }}">{{ text }}</a>
          </p>
        {% endif %}
      {% endif %}
    {% endfor %}
  </details>
{% endfor %}
