---
title: "CSS units 'ch' & 'ex'"
lang: en
---

You know them, the usual suspects:

- `rem`: Relative size to root element size. I always set the base size on `:root` and it could be anything - `16px`, `20pt`, `3cm`, …
- `em`: Relative size to the element size. If you have for example `14pt` on the root element, `2em` means `28pt`.
- `px`: Pixel, the dot on the screen. Or it used to be. Now with high density screens one logical pixel could mean four more physical pixels.
- `%` : Relative to the parent element. This is the main difference to `em`. Parent element could be one level up in the DOM.

Then there are more less known units which are dope, nobody uses them (or at least I don't know anyone). But I do. At least one of them.

- `ch`: Width of the character `0`
- `ex`: Hight of the character `x`, the good old x-height.

<!--=include ch.html -->

<!--=include ex.html -->

Cool, but what about that? The `ex` isn't that interesting or practical. I've wanted to visualised it because as you can see, every typeface has distinct x-height. The `ch` not the other hand is handy and I use it all the time. ==It's the `em` unit on horizontal axis.==

Let's compare to containers with dummy text. We want to have them approximately 40 characters wide. The first container has maximum width `20em`, the second `20ch`. As you can see, defining width using `ch` has more precise output. The text is approximately 20 characters wide.

<!--=include ch-container.html -->

```css
.em-container {
   max-inline-size: 20em;
}

.ch-container {
   max-inline-size: 20ch;
}
```

That's all. Ahoj.
