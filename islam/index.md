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

{% assign pgurl = "/islam/muhammad" %}
{% capture content %}{% include_relative 02-Muhammad.md %}{% endcapture %}
{% assign content_html = content | markdownify %}

{% assign toc_start = '<!--TOC-->' %}
{% assign toc_end = '<!--/TOC-->' %}
{% capture toc_and_after %}{{ content_html | split: toc_start | last }}{% endcapture %}
{% capture toc_content %}{{ toc_and_after | split: toc_end | first }}{% endcapture %}
{% assign linkreplacement = "<a href=\"" | append: pgurl %}
{% assign toc_content = toc_content | replace: "<a href=\"", linkreplacement %}
{{ toc_content }}