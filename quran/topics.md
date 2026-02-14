---
layout: page
title: "Tafsir al-Jak topics index"
permalink: /quran/topics/
nav_order: 1
---

<style>
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
.topic-links {
  font-size: 0.85em;
  color: #666;
  margin-left: 0.5em;
}
</style>

**[< Back to contents index](/quran/)**

These are all catalogued topics of Tafsir al-Jak for quick reference. Tags are defined without definite or indefinite article to save space and preserve alphabetic order, e.g. look for "Quran" rather than "The Quran". Sub topics are filed after the main topic with a hyphen, e.g. "Allah - cruel".

{%- assign all_entries = "" | split: "" -%}
{%- for page in site.pages -%}
{%- if page.layout == "surah" -%}
{%- assign tag_markers = page.content | split: '((' -%}
{%- for marker in tag_markers offset:1 -%}
  {%- assign tag_content = marker | split: '))' | first | strip -%}
  {%- assign parts = tag_content | split: ',' -%}
  {%- if parts.size >= 2 -%}
    {%- assign ref = parts[0] | strip -%}
    {%- assign ref_parts = ref | split: ':' -%}
    {%- if ref_parts.size == 2 -%}
      {%- assign chapter = ref_parts[0] -%}
      {%- assign verse = ref_parts[1] -%}
      {%- assign link = "/quran/" | append: chapter | append: '/#v' | append: verse -%}
      {%- for tag in parts offset:1 -%}
        {%- assign tag_name = tag | strip  -%}
        {%- assign display = chapter | append: ':' | append: verse -%}
        {%- assign entry = tag_name | append: '|||' | append: link | append: '|||' | append: display -%}
        {%- assign all_entries = all_entries | push: entry -%}
      {%- endfor -%}
    {%- endif -%}
  {%- endif -%}
{%- endfor -%}
{%- endif -%}
{%- endfor -%}
{%- assign sorted_entries = all_entries | sort %}
<h1>Topic Index</h1>
{% unless sorted_entries.size == 0 -%}
{%- assign current_tag = "" -%}
{%- assign use_comma = false -%}
{%- for entry in sorted_entries -%}
{%- assign parts = entry | split: '|||' -%}
{%- assign tag_name = parts[0] -%}
{%- assign tag_id = tag_name | downcase | replace: " ", "-" -%}
{%- assign link = parts[1] -%}
{%- assign display = parts[2] -%}
{%- if tag_name != current_tag %}
<h2 id="{{ tag_id }}">{{ tag_name | capitalize }}</h2>
{% assign current_tag = tag_name -%}
{%- assign use_comma = false -%}
{%- endif -%}
{%- if use_comma %}, {% endif %}<a href="{{ link }}">{{ display }}</a>{%- assign use_comma = true -%}
{%- endfor -%}
{%- endunless -%}