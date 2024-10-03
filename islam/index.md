---
layout: default
title: Table of Contents
---

<h1>Table of Contents</h1>

<ul>
  {% for page in site.pages %}
    {% if page.path contains 'islam/' %}
      <li>
        <a href="{{ page.url }}">{{ page.title }}</a>
      </li>
    {% endif %}
  {% endfor %}
</ul>