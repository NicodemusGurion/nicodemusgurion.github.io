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
{%- assign htmlcontents = contents | markdownify -%}
{% assign htmllines = htmlcontents | split: "<h" %}
First line:<br>
{{ htmllines | first }}<br>
Numlines:<br>
{{ htmllines | size }}<br>
{% assign lines = contents | split: "\n" %}
Number of lines: {{ lines | size }}
{% for line in lines %}
 {% assign splitline = line | split: "# " %}
 {% assign firstpart = splitline | pop %}
 {% assign headerlevel = firstpart | size | plus: 1 %} 
 Header level {{ headerlevel }}<br >
 {% if line contains "#" %}
 NEW LINE<br>
  {{ line }}<br >
 {% endif %}
{% endfor %}
