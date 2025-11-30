---
layout: default 
title: Topic Index
permalink: /quran/topics/
---

<style>
/* Hide <tags> elements by default (before JavaScript runs) */
tags {
display: none;
}

/* Style for topic tag links after JavaScript conversion */
.topic-links {
font-size: 0.85em;
color: #666;
margin-left: 0.5em;
}

.topic-tag {
background: #e8f4f8;
padding: 2px 8px;
border-radius: 3px;
text-decoration: none;
color: #2c5aa0;
margin: 0 3px;
display: inline-block;
transition: background 0.2s;
}

.topic-tag:hover {
background: #d0e7f0;
text-decoration: underline;
}

/* Optional: Style for the topic index page */
.topic-index h2 {
margin-top: 2em;
border-bottom: 2px solid #e0e0e0;
padding-bottom: 0.3em;
}

.topic-index ul {
list-style: none;
padding-left: 0;
}

.topic-index li {
margin: 0.5em 0;
padding-left: 1em;
}

.topic-index li:before {
content: “→ “;
margin-right: 0.5em;
color: #999;
}
</style>
Version 2
{% comment %} Build array of all topic entries {% endcomment %}
{% assign all_entries = “” | split: “” %}


{% for page in site.pages %}
{% if page.layout == "surah" %}
Surah
{% if page.url contains "001" %}
Surah 1
{{ page.content }} 
{% endif %}
{% endif %}
{% endfor %}

