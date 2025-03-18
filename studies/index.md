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

# Statistics

[Religiosity survey from Iran](public/pdf/GAMAAN-Iran-Religion-Survey-2020-English.pdf)


# Papers

[The physical death of Jesus](public/pdf/The_Physical_Death_of_Jesus.pdf)

[High literacy levels in ancient Judea](public/pdf/high-literacy-levels-in-600bc-judah.pdf)

[Dating the two censuses of Quirinius](public/pdf/Dating_the_two_Censuses_of_Quirinius.pdf)

[Crucifixion in the Mediterranean world](public/pdf/Crucifixion-in-the-Mediterranean-world.pdf)

[CHILDREN AND CHILDHOOD IN LIGHT OF THE DEMOGRAPHICS OF THE JEWISH FAMILY IN LATE ANTIQUITY by AMRAM TROPPER](public/pdf/CHILDREN AND CHILDHOOD IN LIGHT OF THE DEMOGRAPHICS OF THE JEWISH FAMILY IN LATE ANTIQUITY by AMRAM TROPPER.pdf)

[The average lifespan in the first cebtury](public/pdf/average-lifespan-in-first-century-35-years.pdf)

[CIA: Analysis and Assessment of Gateway process](public/pdf/Analysis and Assessment of Gateway process cia-rdp96-00788r001700210016-5 (including missing page 25).pdf)

# Other

[Johannes Greber's new testament](public/pdf/Johannes-Greber-New-Testament.pdf)