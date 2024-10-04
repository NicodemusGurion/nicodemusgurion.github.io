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

{% assign lines = contents | split: "
" %}
<pre>
{% for line in lines %}
{% assign firstchar = line | split "" | first %}
{% unless firstchar == "#" %}{% continue %}{% endunless %}
- {{ line }}
{% endfor %}
</pre>