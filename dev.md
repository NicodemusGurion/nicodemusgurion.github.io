---
title: development
permalink: /dev/
layout: page
---

{% assign sortable = "" | split: "" %}

{% assign mypages = site.pages | where: "toc" %}

{% for p in mypages %}
  {% if p.title %}
    {% assign sortkey = p.tocpath | default: p.url %}
    {% assign sortkey = sortkey | append: " " %}

    {% capture line %}
{{ sortkey }}|||{{ p.url }}|||{{ p.title }}
    {% endcapture %}

    {% assign sortable = sortable | push: line %}
  {% endif %}
{% endfor %}

{% assign sortable = sortable | sort %}

<ul class="toc-root">
{% assign prev_depth = 0 %}

{% for entry in sortable %}
  {% assign parts = entry | split: "|||" %}
  {% assign sortkey = parts[0] | strip %}
  {% assign url = parts[1] %}
  {% assign title = parts[2] %}

  {% assign depth = sortkey | split: "/" | size | minus: 2 %}

  {% if depth > prev_depth %}
    {% for i in (prev_depth..depth-1) %}
      <ul>
    {% endfor %}
  {% elsif depth < prev_depth %}
    {% for i in (depth..prev_depth-1) %}
      </li></ul>
    {% endfor %}
    </li>
  {% else %}
    </li>
  {% endif %}

  <li>
    <a href="{{ url }}">{{ title }}</a>

  {% assign prev_depth = depth %}
{% endfor %}

{% for i in (0..prev_depth-1) %}
  </li></ul>
{% endfor %}
</ul>