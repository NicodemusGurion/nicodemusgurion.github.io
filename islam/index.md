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
I'm 
{% for line in htmllines %}
  {% assign firstchar = line | slice: 0 %}
  {% if "123456" contains firstchar %}
   {% assign header = line | split: ">" %}
   {% assign header = header[1] | split: "<" %}
   {% assign listlevel = firstchar | plus: 0 %}
   
   {% if listlevel > lastlistlevel %}
   <li>step up<ul>
   {% elsif listlevel < lastlistlevel %}
   </ul>step down</li>
   {% endif %}
   <li>{{ listlevel }} {{ lastlistlevel }} - {{ header[0] }}</li>
   
     
	{% assign lastlistlevel = listlevel %}
  {% endif %}
{% endfor %}
</ul>
