---
layout: post
title: "HTTP Route Busting"
date: 2017-09-29 11:33:05
description: "Enumerating Routes Instead of Directories"
tags: presentation
categories: Presentation Research
twitter_text:
---
I did a talk at CactusCon 2017 about HTTP Route Busting.

Here is the slides if you would like a copy:
[HTTP Route Busting](/assets/files/HTTP-Route-Busting.pdf)

Apparently there were more questions that just didn’t load so I will get to them in this post:

#### The slides are very difficult to read from halfway back in the room, especially the text that's in light.. pink?  maybe?  Can they be reposted online somewhere?

* Yes! The slides can be downloaded here. The AV team was having some issues with the projector and that was the best we could have done. Sorry about that :/

#### Are you concerned about verbs besides GET causing unwanted changes?

* Even GET can cause unwanted changes. That is always a risk when doing a blackbox test. If an application allows you to make changes without authentication, that might be a issue itself.

#### What tool do you use for setting markers in code?

* The tool that I displayed on screen was Burp Suite and more specifically the Intruder function.

#### What are the most popular web frameworks used today?  Are there any new frameworks that you have started working for?

* It really depends onf the language. I have seen a lot of Express for Node, Java Spring is also popular, and Slim for php. Swagger is really popular for documentation as well. 

