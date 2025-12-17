---
layout: menu
title: "Tafsīr al-Jāk"
---

## Naẓra Masīḥiyya



{%- assign surah_pages = site.pages | where: "layout", "surah" | sort: "path" -%}

<ul>
{%- for page in surah_pages -%}
  <li><a href="{{ page.url }}">{{ page.title }}</a></li>
{%- endfor -%}
</ul>