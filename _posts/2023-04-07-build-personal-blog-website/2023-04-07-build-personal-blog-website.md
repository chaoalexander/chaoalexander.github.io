---
layout: post
title: "Build a personal web blog use GithubPage and Jekyll"
categories: other
author: chaoalexander
comment: True
---

I have already wanted to establish my own blog website to encourage myself to learn and share, but purchasing domain servers, public IP addresses, and so on made me hesitate. Fortunately, I found that it wasn't really difficult. I spent not much time to built this website, using [Github Page][github page] and [Jekyll][jekyll]. It was so convenient and useful. You can follow my steps to establish your own blog, the style of my blog website is based on [Lil'blog][lil'log], and I like its simplicity.You can search for your favorite personal blogger websites online, or simply use [themes][jekyll themes] recommended by Jekyll.

I test this on my mac ventura

- Create a new repository on github, the key point is your repository must like 'xxxx.github.io', 'xxxx' is your github's username.

- Use gem install ruby and bundler,you can follow [this][this], You must ensure that your Jekyll is installed correctly.I met some mistakes when I run `bundle exec jekyll serve`, finally I update my ruby version to 3.1,and then everything is ok.

- In the step 1,we have created a new repository,then you can add this remote git repository to the local,run the followling command locally,it's a empty repository
```shell
git clone git@github.com:username/username.github.io.git
```

- Create a new directory locally,then pull the minima theme code
```shell
cd ~ && mkdir tmp && cd tmp && git clone git@github.com:jekyll/minima.git
cd ~ && mv ./tmp/minima/* ./username.github.io
cd ~/username.github.io && jekyll serve
```
If you can run the above command successfully, you can view your website locally, Open website address in your browser http://127.0.0.1:4000/ ,when you update your code locally,you can refresh your borwser to see the effect.

- You must read [this][minima] to get more information about minima,it helps you understand the structure of the minima theme directory.Next, I will make some customized modifications to the minima theme. You can refer to it or customize your own.

1. Add pagination function and modify it to look better

	/_config.yml
	```yml
	plugins:
	  - jekyll-paginate
	paginate: 3
	paginate_path: "/page:num/"
	```

	/Gemfile
	```
	gem "jekyll-paginate", "~> 1.1"
	```

	Change /index.md to /index.html
	```shell
	mv ./index.md index.html
	```

	/_layouts/home.html
	```html
	    { if site.paginate }
	      <div class="pager">
	        <ul class="pagination">
	        {- if paginator.previous_page }
	          <li><a href="{{ paginator.previous_page_path | relative_url }}" class="previous-page">{{ paginator.previous_page }}</a></li>
	        {- else }
	        
	          <li><div class="pager-edge">•</div></li>
	        {- endif } 
	          <li><div class="current-page">{{ paginator.page }}</div></li>
	        {- if paginator.next_page }
	          <li><a href="{{ paginator.next_page_path | relative_url }}" class="next-page">{{ paginator.next_page }}</a></li>
	        {- else }
	          <li><div class="pager-edge">•</div></li>
	        {- endif } 
	        </ul>
	      </div>
	    {- endif } 

	  {- endif -% }
	```
	Change to
	```html
	    { if site.paginate }
	      <div class="pager">
	        <ul class="pagination">
	        {- if paginator.previous_page }
	          <li><a href="{{ paginator.previous_page_path | relative_url }}" class="previous-page">{{ paginator.previous_page }}</a></li>
	        {- else }

	        {- endif } 
	          <li><div class="current-page">{{ paginator.page }}</div></li>
	        {- if paginator.next_page }
	          <li><a href="{{ paginator.next_page_path | relative_url }}" class="next-page">{{ paginator.next_page }}</a></li>
	        {- else }

	        {- endif } 
	        </ul>
	      </div>
	    {- endif } 

	  {- endif -% }
	```

	Add css to paginate button
	```shell
	vim ./assets/css/extra.css
	```
	/assets/css/extra.css
	```css
	/*paginate style*/
	.pager {
	  margin: 0;
	  text-align: center;
	}

	.pager .pagination {
	  margin: 0;
	  padding: 0;
	  text-align: center;
	  display: inline-block;
	  list-style: none;
	}

	.pager .pagination li {
	  display: inline-block;
	  margin: 0;
	  padding: 0;
	}

	.pager .pagination li .pager-edge {
	  display: inline-block;
	  margin: 0;
	  padding: 0;
	  border: none;
	}

	.pager .pagination li a,
	.pager .pagination li .current-page {
	  display: inline-flex;
	  align-items: center;
	  justify-content: center;
	  margin: 0;
	  padding: 0;
	  width: 2em;
	  height: 2em;
	  border-radius: 50%;
	  background-color: #f5f5f5;
	  color: #333;
	  text-decoration: none;
	  font-weight: bold;
	}

	.pager .pagination li a:hover {
	  background-color: #ddd;
	}

	.pager .pagination li .current-page {
	  background-color: #333;
	  color: #fff;
	}

	.pager .pagination li a:hover {
	  background-color: #ddd;
	}

	.pager .pagination li .current-page {
	  background-color: #333;
	  color: #fff;
	}
	```

	Add css file to head

	/include/head.html
	```html
	  <link rel="stylesheet" href="{{ "/assets/css/style.css" | relative_url }}">
	  <link rel="stylesheet" type="text/css" href= "{{ "/assets/css/extra.css" | relative_url }}" >
	```

2. Present the post in a card format

	/_layouts/home.html
	```html
	  {- if posts.size > 0 -}
	    {- if page.list_title -}
	      <h2 class="post-list-heading">{{ page.list_title }}</h2>
	    {- endif -% }
	    <ul class="post-list">
	      {- assign date_format = site.minima.date_format | default: "%b %-d, %Y" -}
	      {- for post in posts -}
	      <li>
	        <span class="post-meta">{{ post.date | date: date_format }}</span>
	        <h3>
	          <a class="post-link" href="{{ post.url | relative_url }}">
	            {{ post.title | escape }}
	          </a>
	        </h3>
	        {- if site.show_excerpts -}
	          {{ post.excerpt }}
	        {- endif -% }
	      </li>
	      {- endfor -}
	    </ul>
	```
	Change to
	```html
	  {- if posts.size > 0 -}
	    {- if page.list_title -}
	      <h4 class="post-list-heading">{{ page.list_title }}</h4>
	    {- endif -% }
	    <ul class="post-list">
	      {- assign date_format = site.minima.date_format | default: "%b %-d, %Y" -}
	      {- for post in posts -}
	      <li class="post-card">
	        <div class="post-card-header">
	  <h5>
	    <a class="post-link" href="{{ post.url | relative_url }}">
	      {{ post.title | escape }}
	    </a>
	  </h5>
	  <p class="post-date">{{ post.date | date: "%Y-%m-%d" }}</p>
	  <p class="post-summary">{{ post.excerpt | truncatewords: 30 }}</p>
	  </div>
	</li>
	      {- endfor -}
	    </ul>
	```


	/assets/css/extra.css
	```css
	/*content card style*/
	.post-card {
	  background-color: #ffffff;
	  border: 1px solid #ddd;
	  border-radius: 10px;
	  margin-bottom: 10px;
	  padding: 16pt;
	  max-height: 12em;
	  overflow: hidden;

	}

	.post-card-header h5 {
	  margin: 0;
	}

	.post-date {
	  font-size: 14px;
	  color: #666;
	}

	.post-summary {
	  margin-top: 10px;
	  font-size: 16px;
	  line-height: 1.5;
	  color: #333;
	}
	```

	/_config.yml
	```yml
	show_excerpts: True
	```

3. Add webpage icon

	You must have an icon image with a size of 16 * 16 first, you can visit [this][icon] to get a icon.
	Create a folder named 'images' in assets, add icon to folder /assets/images/youricon.ico

	/include/head.html
	```html
	  <link rel="stylesheet" type="text/css" href= "{{ "/assets/css/extra.css" | relative_url }}" >
	  <link rel="icon" type="image/png" href="{{ '/assets/images/youricon.ico' | relative_url }}" sizes="16x16">
	```

4. Modify navigation bar

	_config.yml
	```yml
	title: xx's blog
	```

	/_sass/minima/_layout.scss
	```css
	/**
	 * Site header
	 */
	.site-header {
	  border-top: 5px solid $border-color-03;
	  border-bottom: 1px solid $border-color-01;
	  min-height: $spacing-unit * 1.865;
	  line-height: $base-line-height * $base-font-size * 2.25;

	  // Positioning context for the mobile navigation icon
	  position: relative;
	}
	```
	Change to

	```css
	/**
	 * Site header
	 */
	.site-header {
	border: none;
	background-color: transparent;
	min-height: $spacing-unit * 1.865;
	line-height: $base-line-height * $base-font-size * 2.25;
	position: relative;

	font-family: "Segoe UI", Arial, sans-serif;
	font-size: 15px;
	font-weight: bold;
	/*text-transform: uppercase;*/
	letter-spacing: 0.05em;
	}
	```

5. Add self introduction and social contact information

	_config.yml 
	```yml
	  social_links:
	  #   - { platform: devto,          user_url: "https://dev.to/jekyll" }
	  #   - { platform: dribbble,       user_url: "https://dribbble.com/jekyll" }
	  #   - { platform: facebook,       user_url: "https://www.facebook.com/jekyll" }
	  #   - { platform: flickr,         user_url: "https://www.flickr.com/photos/jekyll" }
	    - { platform: github,         user_url: "https://github.com/jekyll/minima" }
	  #   - { platform: google_scholar, user_url: "https://scholar.google.com/citations?user=qc6CJjYAAAAJ" }
	  #   - { platform: instagram,      user_url: "https://www.instagram.com/jekyll" }
	  #   - { platform: keybase,        user_url: "https://keybase.io/jekyll" }
	  #   - { platform: linkedin,       user_url: "https://www.linkedin.com/in/jekyll" }
	  #   - { platform: microdotblog,   user_url: "https://micro.blog/jekyll" }
	  #   - { platform: pinterest,      user_url: "https://www.pinterest.com/jekyll" }
	  #   - { platform: stackoverflow,  user_url: "https://stackoverflow.com/users/1234567/jekyll" }
	  #   - { platform: telegram,       user_url: "https://t.me/jekyll" }
	    - { platform: twitter,        user_url: "https://twitter.com/jekyllrb" }
	  #   - { platform: youtube,        user_url: "https://www.youtube.com/jekyll" }
	```

	/_layouts/home.html
	```html
	<div class="home">
	  {- if page.title -}
	    <h1 class="page-heading">{{ page.title }}</h1>
	  {- endif -% }
	<div class="about">
	  <p>balabala</p>
	</div>
	  { include social.html }

	  {{ content }}
	```

	Change css of social icon
	/_sass/minima/_layout.scss line 294
	```css
	...
	.social-media-list {
	  display: table;
	  margin: 0 auto;
	  li {
	    float: left;
	    margin: 5px 10px 5px 0;
	    &:last-of-type { margin-right: 0 }
	    a {
	      display: block;
	      padding: 10px 12px;
	      border: 1px solid $border-color-01;
	      &:hover { border-color: $border-color-02 }
	    }
	  }
	}

	...

	```

	Change to 
	```css
	.social-media-list {
	  width: 100%;
	  padding: 0;
	  margin: 0 10px 10px;
	  text-align: left;
	  
	  li {
	    display: inline-block;
	    list-style: none;
	    margin-right: 10px;
	    
	    &:last-of-type {
	      margin-right: 0;
	    }
	    
	    a {
	      display: flex;
	      color: #333;
	      align-items: center;
	      justify-content: center;
	      width: 35px;
	      height: 35px;
	      border: none;
	      background-color: transparent;
	      
	      svg {
	        width: 20px;
	        height: 20px;
	        fill:  #159;
	      }
	      
	      &:hover {
	        background-color: #f1f1f1;
	      }
	    }
	  }
	}
	```


6. Delete page footer

	_layouts/base.html
	```html
	 <!-- {- include footer.html -} -->
	```

7. Add the function of back to the top in the post details page

	Create folder named js in /assets, enter this folder, then create a js file named 'back_to_top'.js

	/assets/js/back_to_top.js
	```javascript
	window.onscroll = function() {
	    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
	        document.getElementById("back-to-top").style.display = "block";
	    } else {
	        document.getElementById("back-to-top").style.display = "none";
	    }
	};

	document.getElementById("back-to-top").addEventListener("click", function() {
	    // calculate scroll distance
	    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
	    var scrollStep = Math.PI / (500 / 15);
	    var cosParameter = scrollTop / 2;
	    var scrollCount = 0;
	    var scrollMargin;
	    var scrollInterval = setInterval(function() {
	        if (document.documentElement.scrollTop !== 0) {
	            scrollCount = scrollCount + 1;
	            scrollMargin = cosParameter - cosParameter * Math.cos(scrollCount * scrollStep);
	            document.documentElement.scrollTop = document.body.scrollTop = scrollTop - scrollMargin;
	        } else {
	            clearInterval(scrollInterval);
	        }
	    }, 15);
	});
	````

	Add a button to the post.html, place it in the bottom right corner of the page

	_layouts/post.html
	```html
	---
	layout: base
	---
	<script src="{{ "/assets/js/back_to_top.js" | relative_url }}"></script>
	<article class="post h-entry" itemscope itemtype="http://schema.org/BlogPosting">

	...

	  <a class="u-url" href="{{ page.url | relative_url }}" hidden></a>
	</article>

	<a href="#" id="back-to-top"></a>
	```
	Add css to the button

	/assets/css/extra.css
	```css
	/*back to top*/
	#back-to-top {
	    display: none;
	    position: fixed;
	    bottom: 50px;
	    right: 25px;
	    z-index: 99;
	    width: 30px;
	    height: 30px;
	    border-radius: 50%;
	    background-color: rgba(10, 10, 10, 0.3);
	    color: #fff;
	    cursor: pointer;
	    text-align: center;
	    line-height: 30px;
	}

	#back-to-top:hover {
	    background-color: #333;
	}

	#back-to-top::before {
	  content: "\2191";
	  font-size: 18px;
	  position: absolute;
	  top: 50%;
	  left: 50%;
	  transform: translate(-50%, -50%);
	}

	```

8. Add comment function

	The implementation of the comment function must rely on [disqus][disqus], a free comment publishing and management platform that implements a comment management interface that minima can easily use.

	Firstly, you must register a disqus account, set your comment url like 'username.disqus.com',more information visit [here][username].

	Then you can find a piece of code named `Universal Embed Code` in your disqus account,and paste it into the disqus_comments.html, more information visit [here][install].

	_config.yml
	```yml
	disqus:
	  shortname: username
	```

	Sometimes you must modify disqus_comments.html

	/includes/disqus_comments.html
	```html

	s.src = 'https://{ site.disqus.shortname }.disqus.com/embed.js';

	```
	Change to 

	```html
	s.src = 'https://username.disqus.com/embed.js';
	```

	The comment function only works in the production environment. If you want to test locally, you can run the command:
	```shell
	jekyll serve JEKYLL_ENV=production 
	```

	If you don't want to display comments for a particular post you can disable them by adding comments: false to that post's YAML Front Matter.

9. Organize folders and place html files in separate folders

	```shell
	mkdir pages && mv about.md pages/ && mv 404.html /pages
	```

10. Deploy website

	Run following command in your terminal
	```
	git add .
	git commit -m 'init website'
	git push
	```
	Your github repository - Setting - Pages ,select the branch you want to built, wait for a minutes, you will see the information like this 'Your site is live at https://username.github.io/'



	Tips: {% raw %} {% keyword %} {% endraw %} in the Jekyll liquid syntax is a special tag, so I replaced it with {keyword} in this post.

	Congratulations~



[github page]: https://pages.github.com/
[jekyll]: https://jekyllrb.com/docs/
[lil'log]: https://lilianweng.github.io/
[jekyll themes]: https://pages.github.com/themes/
[this]: https://jekyllrb.com/docs/
[minima]: https://github.com/jekyll/minima
[icon]: https://realfavicongenerator.net/
[disqus]: https://disqus.com/
[username]: https://help.disqus.com/en/articles/1717111-what-s-a-shortname
[install]: https://yourdisqususername.disqus.com/admin/settings/jekyll/
