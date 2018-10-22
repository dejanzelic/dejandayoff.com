---
layout: post
title: "Natas Level2 - Level3"
date: 2015-09-24 22:25:56
description:
tags: Natas CTF
categories: Natas
twitter_text:
---
The page says:

"There is nothing on this page"

hmmm... First I start with inspecting the element.

![Screenshot1](/assets/img/screenshots/Natas_level2-1.png)

I saw that there was a random image. Lets navigate to that image:

![Screenshot2](/assets/img/screenshots/Natas_level2-2.png)

As it says in the name, the image is just a pixel. I decided to try to see if they apache directory listing turned on and they do!

![Screenshot3](/assets/img/screenshots/Natas_level2-3.png)

Once there I simply grabbed the users.txt file that contained the following users:

    # username:password
    alice:BYNdCesZqW
    bob:jw2ueICLvT
    charlie:G5vCxkVV3m
    natas3:sJIJNW6ucpu6HPZ1ZAchaDtwd7oGrD14
    eve:zo4mJWyNj2
    mallory:9urtcpzBmH
    
We are obviously looking for the password to natas3:
sJIJNW6ucpu6HPZ1ZAchaDtwd7oGrD14

