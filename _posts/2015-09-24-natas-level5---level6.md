---
layout: post
title: "Natas Level5 - Level6"
date: 2015-09-24 22:26:15
description:
tags: Natas CTF
categories: Natas
twitter_text:
---
Natas5 starts me out with another "Access Denied" page. To see what is going on, I decide to capture the requests.

The first request I capture contains some interesting information:

![Screenshot1](/assets/img/screenshots/Natas_level5-1.png)

Looking at the Cookies header, I notice one of the cookie is called "loggedin" and the value is currently set to 0. I wonder what would happened if I change that to a 1.

Looks like that was it! I was able to get a password for natas6:

![Screenshot2](/assets/img/screenshots/Natas_level5-2.png)

aGoY4q2Dc6MgDq4oL4YtoKtyAg9PeHa1
