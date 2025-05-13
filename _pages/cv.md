---
layout: archive
title: "CV"
permalink: /cv/
author_profile: true
redirect_from:
  - /resume
---

{% include base_path %}

Education
======
* PhD in Computer Science, University of Bristol, 2028 (expected)
* MSc in Image and Video Communication Signal Processing, University of Bristol, 2024
* BEng in Electronic Information Engineering, South China Agricultural University, 2023

Work experience
======
* 2025: OpenInterX
  * Research Intern
  * Duties includes: MLLM Post-train
  * Supervisor: Shawn

* 2024: Toshiba Research
  * Research Intern
  * Duties includes: VLN
  * Supervisor: Marius Jurt
  
Skills
======
* Skill 1
* Skill 2
  * Sub-skill 2.1
  * Sub-skill 2.2
  * Sub-skill 2.3
* Skill 3

Publications
======
  <ul>{% for post in site.publications reversed %}
    {% include archive-single-cv.html %}
  {% endfor %}</ul>
  
Talks
======
  <ul>{% for post in site.talks reversed %}
    {% include archive-single-talk-cv.html  %}
  {% endfor %}</ul>
  
Teaching
======
  <ul>{% for post in site.teaching reversed %}
    {% include archive-single-cv.html %}
  {% endfor %}</ul>
  
Service and leadership
======
* Currently signed in to 43 different slack teams
