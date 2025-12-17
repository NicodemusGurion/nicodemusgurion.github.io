---
layout: default
title: Topic Index
permalink: /quran/topics/
foo: bar12
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
      {%- if chapter.size == 1 -%}
        {%- assign chapter_padded = '00' | append: chapter -%}
      {%- elsif chapter.size == 2 -%}
        {%- assign chapter_padded = '0' | append: chapter -%}
      {%- else -%}
        {%- assign chapter_padded = chapter -%}
      {%- endif -%}
      {%- assign link = "/quran/" | append: chapter_padded | append: '/#v' | append: verse -%}
      {%- for tag in parts offset:1 -%}
        {%- assign tag_name = tag | strip | downcase | replace: " ", "-" -%}
        {%- assign display = chapter | append: ':' | append: verse -%}
        {%- assign entry = tag_name | append: '|||' | append: link | append: '|||' | append: display -%}
        {%- assign all_entries = all_entries | push: entry -%}
      {%- endfor -%}
    {%- endif -%}
  {%- endif -%}
{%- endfor -%}
{%- endif -%}
{%- endfor -%}
{%- assign sorted_entries = all_entries | sort -%}
<h1>Topic Index</h1>
{%- unless sorted_entries.size == 0 -%}
{%- assign current_tag = "" -%}
{%- assign use_comma = false -%}
{%- for entry in sorted_entries -%}
{%- assign parts = entry | split: '|||' -%}
{%- assign tag_name = parts[0] -%}
{%- assign link = parts[1] -%}
{%- assign display = parts[2] -%}
{%- if tag_name != current_tag %}
<h2 id="{{ tag_name }}">{{ tag_name | capitalize }}</h2>
{% assign current_tag = tag_name -%}
{%- assign use_comma = false -%}
{%- endif -%}
{%- if use_comma %}, {% endif %}<a href="{{ link }}">{{ display }}</a>{%- assign use_comma = true -%}
{%- endfor -%}
{%- endunless -%}