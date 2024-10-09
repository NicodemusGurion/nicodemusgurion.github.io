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
        {% capture content %}{% include_relative {{ pg.path }} %}{% endcapture %}
		{% assign content_html = content | markdownify %}
		{% assign toc_start = '<!--TOC-->' %}
		{% assign toc_end = '<!--/TOC-->' %}
		{% capture toc_and_after %}{{ content_html | split: toc_start | last }}{% endcapture %}
		{% capture toc_content %}{{ toc_and_after | split: toc_end | first }}{% endcapture %}
		{% assign linkreplacement = '<a href="' | append: page.dir %}
		{% assign toc_content = toc_content | replace: ' id="markdown-toc"', '' | replace: '<a href="', linkreplacement %}
		{{ toc_content }}
      </li>
    {% endif %}
    {% endif %}
  {% endfor %}
</ul>
Too




