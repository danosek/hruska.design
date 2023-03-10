---
title: Container Queries and Responsive Typography 
lang: en
---

If you were designing and styling web components containing text, you‘ve ran into an issue. You’ve wanted the text to have dynamic size based on element size. Container Queries have enabled just that. 

Having said that, setting font size to CQ unit alone is not doing exactly the thing. When the container is small, text is barely legible. And when the container is wide, text becomes huge. 

We have to add boundaries for minimum and maximum font size. And that is a perfect use-case for function `clamp()`. You pass three values as parameters:
- Minimum
- Preferred
- Maximum

For example:

```
font-size: clamp(1rem, 3cqi, 3rem)
```

Does this (you can resize the element):

<!--=include cq-typography.html -->

That's all. Ahoj.