---
layout: menu
title: Studies and other data
---

<h1>Table of Contents</h1>

{% assign current_url = page.url %}

<ul id="markdown-toc">
  {% for pg in site.pages %}
    {% if pg.url contains 'studies/' %}
    {% if pg.url != page.url %}
      <li>
        <a href="{{ pg.url }}">{{ pg.title }}</a>
        {% capture content %}{% include_relative {{ pg.name }} %}{% endcapture %}
		{% assign content_html = content | markdownify %}
		{% assign toc_start = '<!--TOC-->' %}
		{% unless content_html contains toc_start %}{% continue %}{% endunless %}
		{% assign toc_end = '<!--/TOC-->' %}
		{% capture toc_and_after %}{{ content_html | split: toc_start | last }}{% endcapture %}
		{% capture toc_content %}{{ toc_and_after | split: toc_end | first }}{% endcapture %}
		{% assign linkreplacement = '<a href="' | append: pg.dir %}
		{% assign toc_content = toc_content | replace: ' id="markdown-toc"', '' | replace: '<a href="', linkreplacement %}
		{{ toc_content }}
      </li>
    {% endif %}
    {% endif %}
  {% endfor %}
</ul>


# Papers

[The physical death of Jesus](public/pdf/The_Physical_Death_of_Jesus.pdf)

