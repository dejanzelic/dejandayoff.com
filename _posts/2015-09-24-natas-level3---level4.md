---
layout: post
title: "Natas Level3 - Level4"
date: 2015-09-24 22:26:03
image: '/assets/img/'
description:
tags: Natas CTF
categories: Natas
twitter_text:
---
Looks like natas3 contains the same message as natas2:
" There is nothing on this page "

Again I start by inspecting the element. Instead of a picture, this time we get a hint in the HTML:

![Screenshot1](/assets/img/screenshots/Natas_level3-1.png)

This is obviously a hint that there might be something in the robots.txt. So I navigated to http://natas3.natas.labs.overthewire.org/robots.txt and found the following file:

    User-agent: *
    Disallow: /s3cr3t/

So I navigated to the /s3cr3t/ directory and found another users.txt file with the following content:

    natas4:Z9tkRkWmpt9Qr7XrR5jWRkgOU901swEZ


