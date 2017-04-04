---
layout: post
title: "OSCP Review - Felt the Pain and Suffered through it"
date: 2017-04-03 20:30:16
image: '/assets/img/'
description: My review of the Offensive Security Certified Professional certification 
tags: oscp
categories: OSCP
twitter_text: DejanDayoff's OSCP Review
---

On March 15th 2017 I received my Offensive Security Certified Professional (OSCP) Certificate. Well I guess I have yet to receive the physical certificate (they say it could take 60 days), but I have received confirmation that I have passed the test. Over 1 year of studying, 1 failed attempt, and countless hours spent in the lab, I have finally achieved my goal. In this post, I will review the PWK course process, my study strategy, and my exam strategy.

The course and exam break down into the following sections:

+ PWK Course book and exercises
+ In-person PWK Course and exercises (not required, but I encourage anyone who can go to do so)
+ The famous Lab
+ The exam

Below is a rough timeline of how I completed the course work and exam:

+ March 2016 – Began course work and 90 days of lab
+ June 2016 – Began Security Tubes x86 Assembly Course
+ July 2016 – In-person PWK
+ August 2016 – 90 Day extension for lab
+ December 2016 – Exam Attempt #1 
+ February 2017 – 30 Day extension for lab
+ March 2017 – Exam Attempt #2

#Technical Experience before OSCP

Before the OSCP I had less than 1 year of professional security experience. 8 months before, I graduated from College with a bachelors in Computer Information Systems, hardly technical enough to do any practice real world IT jobs. I did, however, run several of my own websites, developed web applications, and managed a home lab. 

As far as certifications, I did obtain the Certified Ethical Hacker (CEH) and Certified Penetration Tester (CPT). The CPT felt like an extremely watered down version of the OSCP and the CEH cannot compare to the OSCP. 

Before the OSCP, I was familiar with web application testing and some basic network testing. I had basically zero knowledge of buffer overflows and exploit writing.

#PWK Course Book, videos, and Exercises

When you start the PWK course you are sent a 320 page PDF book that contains lessons and exercises and an accompanying set of videos. The content of the book and videos is summarized with the publicly available syllabus (https://www.offensive-security.com/documentation/penetration-testing-with-kali.pdf).

My overall opinion of the book is that it was a great starting point to learn about many of the topics necessary to pass the OSCP. However, the book alone is not enough to pass the OSCP. The student needs to do their own research when they do not understand something. The lessons at the end of each section are, in my opinion, required for the course. They do a great job summarizing the sections. 

I cannot stress enough that the book is not enough to pass the OSCP. The windows buffer overflow is discussed in 20 pages, If you have no idea how buffer overflows work, this is not enough content. Since this was a section I struggled a lot with, my recommendation is to check out Vivek Ramachandran’s [x86 Assembly Language and Shellcoding on Linux Course](http://www.pentesteracademy.com/course?id=3). While it might be targeting only Linux, it is still a great way to learn about assembly and how buffer overflows work. 

The videos were very similar to the content in the book. Before taking the exam the first time, I did not watch the videos. During preparation for my second attempt, I did go through all of the videos and it was a great refresher. I played all the videos using VLC and sped up the playback. I appreciate Muts being slow and thorough, but some videos just took too long. 

> Rating: 7/10

#In-person PWK Course and Exercises

As mentioned above, the in-person course is not required but I did have the opportunity to attend a live course at black hat and it was well worth it. My instructor was [Jim O'Gorman](https://twitter.com/_elwood_) and he was amazing! The class was very entertaining. In the beginning, the course started out a bit slow but perfect for people who have never done any kind of penetration testing. After the first day and a half, the pace started to pick up. 

During the entire course, there are OffSec guys walking around and helping out. They encourage asking questions and getting involved in the class. While Offensive Security’s moto is “Try Harder,” I was pleasantly surprised with the amount of assistance that was provided when someone needed help. When asking for help, I never got that “douchey” vibe you might get in some trainings (you defiantly don’t get your hand held through the entire process either). 

Another great part of the in-person course is the gamification of any lesson or challenge. Offensive Security came ready to give out stickers (I know it sounds silly but they are nice stickers), posters, and challenge coins. When you would ask a great question, make your script a little better, or complete a lesson better than others you would receive one of the prizes. For example, one of the exercises in the PWK book is to find multiple methods of escalating privileges on a machine. In the in-person course, Jim offered to the class that whoever gets the most privilege escalations by the next day, they will receive a challenge coin. I spent all night on this challenge and was able to get the challenge coin!
 
<img src='/assets/img/coin.png' width="350">

This course started early in the morning and went till about 5:00-6:00PM. Each day you were given some kind of “homework.” The homework was optional, but that is where I learnt the most. When you are in Vegas for black hat it’s easy to just go out and drink; but, if you are in the PWK course and expect to learn something, my suggestion is: don’t do it, work on the materials. 

Overall the in-person class is only as good as what you put into it and if you are willing to give it your all, you will come out knowing a lot more then you did before. 

> Rating: 9/10

#The PWK Lab

Oh boy the lab! This was my favorite part of the entire course. The first time I purchased the lab time, I did not set any goals and just worked on it when I had a chance. By the end of the 90 days, I only had shell or root on 15 out of the 53 lab boxes. This was very discouraging, however, by the time I purchased the next 90 days of lab time, I had gone through the in-person course and the x86 Assembly training. The second time around, I set a goal of a minimum of 4 roots per week (low-priv shell only counted as .5). By the end of my second lab time I had popped most of the boxes (50/53). 

During my time in the lab, I did not try to avoid metasploit all together like many other students. I find that there is a lot of value in knowing how to use metasploit. However, when possible I did avoid using point and shoot exploits. For example, if there was a metasploit module and a standard exploit out for a vulnerability, I would use the standard exploit first. But if I needed a reverse shell, I would almost always go with a meterpreter shell for its stability, features, and ease of use.

The PWK Lab is where I place most of the value of the OSCP into. Anyone who has their OSCP but did not spend much time in the lab, did not get the full experience. The lab is not all necessary for the exam, but it is necessary if you would like to become a good pentester. Even penetration testers with experience will learn a lot from the PWK Labs. 

> Rating: 10/10

#The Exam

As mentioned above, I attempted the exam 2 times. The first time I over-prepared the day. I read that others have had success by scheduling out their meals, naps, breaks, etc. This did not work for me. I felt that having a ridged schedule like that made me lose focus on the box that I am trying to pop. The first time I took the exam, I started out very strong and got weaker as the day went on. At about 2:30AM (with 6.5 hours to go) I was about 15 points short, fatigued, and reeked of failure. Even basic functions was taking 5 times longer than when I was alert. At about 3:00AM I decided to throw in the towel. I still wrote my report the next day and I lied to myself that if I wrote a very thorough report, I might get extra points. As expected, I got the email that I did not pass shortly after.

The second attempt went a lot better. I still had my meals prepared ahead of time (something lite, sugarless, and healthy) but I did not have a ridged schedule. I avoided coffee in the morning and drank a lot of water. Again I started off strong, but was able to keep the momentum going. I did hit several snags but by 11:00PM I was up to ~90 points + 10 extra credit points (5 for lab material and 5 for course work). At this point, I went to bed confident that as long as I write a good report, I will pass. 

The report took me a lot longer than I expected. My final submission was 260 pages (40 for exam, 220 for lab) and I was very proud of it. I submitted my report Tuesday night and I received the response that I passed Thursday night! I even ended up ordering a hard copy book of my entire report.

While the exam is miles ahead of CEH and CPT (I feel dirty just comparing it to them), it is not without complaints. I am not a fan of the 24 hour nature of the exam. Someone might be a great penetration tester, but just because they crash after 10 hours of straight work, doesn’t mean they are not worthy of the OSCP title. Perhaps the exam could contain more servers but a longer time frame (for example, 10 servers that need to be popped but you are given a week to do it.) I also felt that the lab and exam were different in the types of exploitations needed. I cannot go into detail without divulging too much information about the exam. My recommendation to future students: do not skip the course work.

Overall, the exam was very difficult and a lot of fun. I have a lot of respect to anybody that holds the OSCP title now that I know what it takes to achieve it. 

> Rating: 7/10

# Resources:

[x86 Assembly Language and Shellcoding on Linux](http://www.pentesteracademy.com/course?id=3)

[Windows Privilege Escalation Fundamentals](http://www.fuzzysecurity.com/tutorials/16.html)

[Encyclopaedia Of Windows Privilege Escalation - Brett Moore](https://www.youtube.com/watch?v=kMG8IsCohHA)

[Exploit writing tutorial part 1 : Stack Based Overflows](Exploit writing tutorial part 1 : Stack Based Overflows)

[Basic Linux Privilege Escalation](https://blog.g0tmi1k.com/2011/08/basic-linux-privilege-escalation/)

[OSCP Exam Guide](https://support.offensive-security.com/#!oscp-exam-guide.md)

[How to Pull an Effective All-Nighter](http://lifehacker.com/how-to-pull-an-effective-all-nighter-1569813126)


