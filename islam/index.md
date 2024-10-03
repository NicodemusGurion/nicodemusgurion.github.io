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
 {% if line startswith "#" %}
  {% if line startswith "# " %}
    {% assign header = line | remove_first "# " %}
    {% assign listlevel = 1 %}
  {% elsif line startswith "## " %}
    {% assign header = line | remove_first "## " %}
    {% assign listlevel = 2 %}
  {% elsif line startswith "### " %}
    {% assign header = line | remove_first "### " %}
    {% assign listlevel = 3 %}
  {% elsif line startswith "#### " %}
    {% assign header = line | remove_first "#### " %}
    {% assign listlevel = 4 %}
  {% elsif line startswith "##### " %}
    {% assign header = line | remove_first "##### " %}
    {% assign listlevel = 5 %}
  {% elsif line startswith "###### " %}
    {% assign header = line | remove_first "###### " %}
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
