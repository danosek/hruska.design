---
title: Hello World
lang: en
description: It seems to be a little bit cliché I named first article "Hello World." But you know what – it feels just right on IT slash design related blog. I've had a website before. It didn't had a blog and I didn't communicate anything except my portfolio. So "Hello" again or "Ahoj" as we say in Czech Republic.
---

## First words

It seems to be a little bit cliché I named the first article "Hello World." But you know what – it feels just right on design slash dev related blog. I've had a website before but it didn't have a blog and I didn't communicate anything except my portfolio. So "Hello" again or "Ahoj" as we say here in Czech Republic.

English is not my mother language and sometimes you can find weird phrases, word combinations, wrong tenses or other grammar mistakes. I hope everything will be fine with you. My plan for content is no plan. I'll write down anything what comes in my mind – CSS, Less, HTML, Pug, Sketch or just random thought. In the upcoming months I'll be starting to learning Blender a Three.js so maybe I'll post interesting notes form that. But let's start how I build this page first.

## Under the hood

I'm a designer with skills in HTML and CSS. That said, I've decided to stay in these waters and build static website, even with a blog in mind.

I use [Pug](https://pugjs.org/api/getting-started.html) for generating HTML. What do I like about it?
- Syntax based on indentation. Just tab, tab, tab.
- Stripping angle brackets and closing tags which makes code much cleaner.
- Templates for making global changes in few files
- Calling JS methods within Pug file. For example, in template of this article I use `toLocaleDateString()` for date formatting.
- And of course loops, mixins, variables and other good stuff Pug offers.

Styling is done by CSS (shocker). In this case I use [Less](https://lesscss.org) as my favorite CSS preprocessor. When I've started to learn CSS years ago, company I work for used and is still using Less. So am I. I've used [Sass](https://sass-lang.com) with SCSS syntax in couple of projects but I didn't see a reason to switch. Maybe I'll try Sass with indented syntax, that could be nice. Anyway, what do I like about Less?

- Organizing styles into multiple files
- Nesting selectors
- Mixins and variables for not doing the same thing over and over again. Good chunk of variables I need can be now done by pure CSS Custom Properties. That was not the case few years back. 
- `@import (reference)` for making variables and mixins available only in certain files without compiling the imported one.

When thinking about a blog, [Markdown](https://daringfireball.net/projects/markdown/) is a must. I've been using Markdown for writing and notes more than 10 years. I've wanted my blog to be as simple as possible. Just throw `.md` files in a folder and make things happen. Thankfully there is [gulp-mvb](https://github.com/dennisreimann/gulp-mvb) plugin which is pure gold.

Everything gets gulp down by… [Gulp](https://gulpjs.com) and [npm](https://www.npmjs.com). There are tons of ways how build a website.