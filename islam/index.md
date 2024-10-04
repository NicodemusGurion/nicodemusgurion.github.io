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

{% assign permalink = "/islam/muhammad/" %}

{% assign lines = contents | split: "
" %}
{% assign output = "<ul>" %}

{% for line in lines %}
	{% assign firstchar = line | split: "" | first %}
	{% unless firstchar == "#" %}{% continue %}{% endunless %}
	{% assign parts = line | split: " " %}
	{% assign listlevel = parts[0] | size %}
	{% assign headerid = parts | last %}
	{% assign title = parts | shift | join: " " %}
	{% if headerid contains "{#" %}
		{% assign title = title | remove: headerid | strip %}
		{% assign headerid = headerid | remove: "{#" | remove: "}" %}
	{% else %}
		{% assign headerid = title | remove: "'" | remove: "\"" | slugify %}
	{% endif %}
	{% if listlevel > lastlistlevel %}
		{% assign lastli = output | slice: -5, 5 %}
		{% if lastli == "</li>" %}
			{% assign cutsize = output | size | minus: 5 %}
			{% assign output = output | slice: 0, cutsize  %}
		{% endif %}
		{% assign output = output | append: "<ul>"  %}
	{% endif %}
	{% if listlevel < lastlistlevel %}
		{% assign output = output | append: "</ul></li>"  %}
	{% endif %}
	{% capture link %}<li><a href="">{{title}}</a></li>{% endcapture %}
	{% assign output = output | append: link %}
	{% assign lastlistlevel = listlevel %}
{% endfor %}
{{output}}
</ul>