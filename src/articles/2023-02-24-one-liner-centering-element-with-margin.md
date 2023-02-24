---
title: "One-liner: centering element with margin" 
lang: en
---

Supposing you have an element with width or maximum width, you are trying to center:

```css
.foo {
   margin-inline: auto;
}
```

This is better solution than `margin: 0 auto` because that `0` on block direction could reset margins, you don't want to change.

That's all. Ahoj.

