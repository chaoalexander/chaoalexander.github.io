---
layout: post
title: "How to build a personal web blog use Github and Jekyll"
categories: other
author: chaoalexander

---

A long time ago, I wanted to establish my own blog website to encourage myself to learn and share, but purchasing domain servers, public IP addresses, and so on made me hesitate. Fortunately, I found that it wasn't really difficult. I spent not much time to built this website, using [Github Page][github page] and [Jekyll][jekyll]. It was so convenient and useful that I couldn't wait to share it. You can follow my steps to establish your own personal blog, the style of my blog website is based on [Lil'blog][lil'log], and I really like its simplicity.You can search for your favorite personal blogger websites online, or simply use [themes][jekyll themes] recommended by Jekyll

so ,let's go~

I install this on my mac ventura, I also test it on Ubuntu 20

1. create a new repository on github, the key point is your repository must like 'xxxx.github.io', 'xxxx' is your github's username

2. use gem install ruby and bundler,you can follow [this][this], I met some mistakes when I run `bundle exec jekyll serve`, finally I update my ruby version to 3.1,and then everything is ok.

3. config themes, I choose the minima theme, it doesn't look so flashy, you can get information about [minima][minima]










[github page]: https://pages.github.com/
[jekyll]: https://jekyllrb.com/docs/
[lil'log]: https://lilianweng.github.io/
[jekyll themes]: https://pages.github.com/themes/
[this]: https://jekyllrb.com/docs/
[minima]: https://github.com/jekyll/minima