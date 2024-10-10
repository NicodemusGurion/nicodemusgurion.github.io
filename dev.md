---
title: Dev corner
layout: page
---

{% assign all_docs = site.posts | concat: site.pages %}
{% assign all_docs = all_docs | sort: 'date' | reverse %}

{% for doc in all_docs %}
  <h2>{{ doc.title }}</h2>
{% endfor %}