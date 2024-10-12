---
title: Dev corner
layout: page
noindex: true
---

{% for doc in site.pages %}
{% unless doc.noindex == true %}
  <h2>{{ doc.title }} - {{doc.url}} - {{ doc.path }}</h2>
{% endunless %}
{% endfor %}