---
layout: page
title: "Tafsīr al-Jāk"
image: https://i.ibb.co/K8vVWM6/IMG-0177.png
nav_order: 5
---

A tafsir (or commentary) on the Quran, from a modern Christian perspective, based on the public domain English translation "The meaning of the Glorious Quran" by Mohammed Marmaduke Pickthall, updated with modern vocabulary when necessary for clarity.


{%- assign surah_pages = site.pages | where: "layout", "surah" | sort: "path" %}


<ul>
{% for page in surah_pages -%}
  <li><a href="{{ page.url }}">{{ page.title }}</a></li>
{%- endfor %}
</ul>