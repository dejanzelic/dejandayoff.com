---
layout: post
title: "Natas Level4 - Level5"
date: 2015-09-24 22:26:09
image: '/assets/img/'
description:
tags: Natas CTF
categories: Natas
twitter_text:
---
I was greeted to a "Access disallowed" page for natas4. However, they seem to give you a bit too much information:

![Screenshot1](/assets/img/screenshots/Natas_level4-1.png)

I noticed that the error says that I am coming from "". I assume they are using the HTTP referer header to get this information since I typed in the URL. They also tell you that you should have been coming from "http://natas5.natas.labs.overthewire.org/" 

To change it, all I need to do is capture the request in Burp and add the header:

![Screenshot2](/assets/img/screenshots/Natas_level4-2.png)

After that I am welcomed by a nice "Access Granted" message and the password for the next level:

iX6IOfmpN7AYOQGPwtn3fXpbaJVJcHfq 
