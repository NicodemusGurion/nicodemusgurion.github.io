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



{% assign lastlistlevel = 1 %}
{% capture contents %}{% include_relative 02-Muhammad.md %}{% endcapture %}
{% assign htmlcontents = contents | markdownify %}
{% assign htmllines = htmlcontents | split: "<h" %}
{% assign output = "<ul>" %}

{% for line in htmllines %}
  {% assign firstchar = line | slice: 0 %}
  {% if "123456" contains firstchar %}
  
  
   {% assign header = line | split: ">" %}
   {% assign header = header[1] | split: "<" %}
   {% assign header = header[0] %}
   {% assign listlevel = firstchar | plus: 0 %}
   
	{% assign output = output | append: "<li>" | append: header | append: "</li>" %}
	
	{{ header }}<br>
	{{ output | size }}
    
	{% assign lastlistlevel = listlevel %}

	
  {% endif %}
{% endfor %}

{{ output }}</ul>
