---
layout: post
title: "Natas Level7 - Level8"
date: 2015-09-24 22:26:28
description:
tags: Natas CTF
categories: Natas
twitter_text:
---
Natas7 contains only 2 links, Home and About.

The Home page contains:

![Screenshot1](/assets/img/screenshots/Natas_level7-1.png)

and the About page contains:

![Screenshot2](/assets/img/screenshots/Natas_level7-2.png)

While clicking through it I noticed that the URL changes:

![Screenshot3](/assets/img/screenshots/Natas_level7-3.png)

This makes me think that I have to mess with the URL. A common attack for pages like this is Directory traversal. Imagine if you have the following directory:

	secret/
	├── secretFile
	├── files/
	│   ├── about
	│   └── home

To get the about and home file, you would reference it by typing secret/files/about. However, an attacked can traverse up by using the "../" string. So if an attacker wanted to get to the secretFile, they would need to go to the page /secret/files/../secretFile. 

Natas7 contains the query string: ?page=about. Now imagine that the source code just grabs the about or home file from the same directory it is running in. if we wanted to grab a file from another directory we would include a "../" string before the name of the file. On the first page of natas we are told:

    All passwords are also stored in /etc/natas_webpass/. E.g. the password for natas5 is stored in the file /etc/natas_webpass/natas5 and only readable by natas4 and natas5.

so to get to /etc/natas_webpass/ we would need to go up to the root directory. Since we don't actually know how deep we are in the system we can just use add a bunch of "../"s and then point to "/etc/natas_webpass/" for example:
 
    ?page=../../../../../../../../etc/natas_webpass/natas8
    
If we type that in, the server responds with:

![Screenshot4](/assets/img/screenshots/Natas_level7-4.png)
    
And we get our password:

DBfUBfqQG69KvJvJ1iAbMoIpwSNQ9bWe 

