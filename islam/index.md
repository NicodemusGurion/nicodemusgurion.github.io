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

<ul>

{% assign lastlistlevel = 0 %}
{% capture contents %}{% include_relative 02-Muhammad.md %}{% endcapture %}
{% assign lines = contents | split: "\n" %}
{% for line in lines %}
 {% if line contains "#" %}
  {% assign header = line | remove "#" | remove_first " " | split " {" | first | join "" %}
  {% if line contains "# " %}
    {% assign listlevel = 1 %}
  {% elsif line contains "## " %}
    {% assign listlevel = 2 %}
  {% elsif line contains "### " %}
    {% assign listlevel = 3 %}
  {% elsif line contains "#### " %}
    {% assign listlevel = 4 %}
  {% elsif line contains "##### " %}
    {% assign listlevel = 5 %}
  {% elsif line contains "###### " %}
    {% assign listlevel = 6 %}
  {% endif %}
  {% if listlevel > lastlistlevel %}
   <li>
   <ul>
  {% endif %}
  {% if listlevel < lastlistlevel %}
   </ul>
   </li>
  {% endif %}
  {% assign lastlistlevel = listlevel %}
  <li>{{ header }}</li>
 {% endif %}
{% endfor %}
