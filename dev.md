---
title: development
permalink: /dev/
layout: page
---

{% assign sortable = "" | split: "" %}

{% for p in site.pages %}
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

<ol>
{% for entry in sortable %}
  {% assign parts = entry | split: "|||" %}
  {% assign sortkey = parts[0] | strip %}
  {% assign url = parts[1] %}
  {% assign title = parts[2] %}

  <li>
    <a href="{{ url }}">{{ title }}</a>
    <small>{{ sortkey }}</small>
  </li>
{% endfor %}
</ol>