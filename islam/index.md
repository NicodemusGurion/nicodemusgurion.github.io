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
        {{ pg.url }}={{ page.url }}<br>
        {{ pg.name }}={{ page.name }}<br>
        {{ pg.path }}={{ page.path }}<br>
        <a href="{{ pg.url }}">{{ pg.title }}</a>
      </li>
    {% endif %}
    {% endif %}
  {% endfor %}
</ul>

<ul>


{% capture contents %}{% include_relative 02-Muhammad.md %}{% endcapture %}

{{ contents | markdownify }}