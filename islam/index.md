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
<pre>
{% for line in htmllines %}
  {% assign firstchar = line | slice: 0 %}
  {% if "123456" contains firstchar %}
  
  
   {% assign header = line | split: ">" %}
   {% assign header = header[1] | split: "<" %}
   {% assign header = header[0] | strip %}
   
   {% assign listlevel = firstchar | plus: 0 %}
   
	{% assign output = output | append: "<li>" | append: header | append: "</li>" %}
	
	{% assign headerid = line | split: "id=\"" %}
   
   {{ header }}
   
   {% for h in headerid %}
   
   {{ h }}
   
   {% endfor %}
    
	{% assign lastlistlevel = listlevel %}

	
  {% endif %}
{% endfor %}
</pre> 


{{ output }}</ul>
