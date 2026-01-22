---
layout: page
title: Teachings of Islam
image: https://i.ibb.co/9H5GWT83/IMG-0248.jpg
toc: true
---

<h1>Table of Contents</h1>

{% assign root = page.url | split: "/" %}
{% assign root_path = root | pop | join: "/" | append: "/" %}

{% assign candidates = site.pages | where_exp: "p", "p.url != page.url" %}
{% assign children = "" | split: "" %}

{% for p in candidates %}
  {% if p.url contains root_path %}
    {% assign entry = p %}
    {% assign children = children | push: entry %}
  {% endif %}
{% endfor %}

{% assign sorted = children | sort: "tocpath" %}

<ul>
{% for p in sorted %}
  {% assign placement = p.tocpath | default: p.url %}
  {% if placement contains root_path %}

  <li>
    <a href="{{ p.url }}">{{ p.title | default: p.url }}</a>

    {% assign headers = p.content | split: "<h" %}
    {% if headers.size > 1 %}
    <ul>
      {% for h in headers offset:1 %}
        {% assign level = h | slice: 0,1 %}
        {% assign id = h | split: 'id="' | last | split: '"' | first %}
        {% assign text = h | split: ">" | last | split: "<" | first | strip %}

        {% if id != "" %}
        <li>
          <a href="{{ p.url }}#{{ id }}">{{ text }}</a>
        </li>
        {% endif %}
      {% endfor %}
    </ul>
    {% endif %}

  </li>

  {% endif %}
{% endfor %}
</ul>