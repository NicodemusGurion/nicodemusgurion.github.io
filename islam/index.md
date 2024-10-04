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
{% assign htmlcontents = contents | markdownify %}
{% assign htmllines = htmlcontents | split: "<h" %}
First line:<br>
{{ htmllines | first }}<br>
Numlines:<br>
{{ htmllines | size }}<br>

{% for line in htmllines %}
  {% assign firstchar = line | slice: 0 %}
  First character: "{{ firstchar }}"<br>
{% endfor %}
