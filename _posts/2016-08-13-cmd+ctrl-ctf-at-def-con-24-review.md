---
layout: post
title: "CMD+CTRL CTF at DEF CON 24 Review"
date: 2016-08-13 17:07:23
description:
tags: DEFCON CTF
categories: DEFCON CTF
twitter_text: CMD+CTRL CTF Review
---
This year our CTF team (Savage Submarine) took first place in CMD+CTRL at DEF CON 24! This is my review of the CTF challenges and scoreboard and the overall experience. I will not be providing any walkthroughs or answers since the CMD+CTRL creators will be using these challenges again in other competitions.

Savage Submarine consisted of:

[@amoldp18](https://twitter.com/amoldp18)

[@crowdshield](https://twitter.com/crowdshield) [site](https://crowdshield.com/)

[@dejandayoff](https://twitter.com/dejandayoff)

[@hackerbyhobby](https://twitter.com/hackerbyhobby)

[@tibaal89](https://twitter.com/tibaal89) [site](https://tibaal.github.io/)

We started off by walking around the DEF CON contest area trying to find the SecureNinja CTF. However, we ran into the CMD+CTRL booth and they convinced us to sign up. All of the tables were full in the contest area so we decided to go to the Café Arcade and sit down.

![DEF CON 24 Map](/assets/img/ctf/cmdnctrl/DEFCON_24_map.png)

After a couple of hours our batteries were dying and Wi-Fi was getting sketchy. We also secured a decent position on the scoreboard so we decided to go over to the Cosmopolitan and continue hacking from there.

## The Scoreboard

I'm using the term "scoreboard" to mean the overall score tracking, team management, and launch panel of the CTF. The most impressive part of the scoreboard was that each team was given their own instance of each vulnerable application. You are not sharing applications amongst other teams. If you ever break anything, you are able to reset the entire server at any time or just the database.

![launch panel](/assets/img/ctf/cmdnctrl/CMD_n_CTRL_Scoreboard.png)

The only negative about resetting an instance is that it took forever to start and you would receive a new URL each time. However, I believe that both of these issues are not CMD+CTRL's implementation but AWS' implementation.

Another cool feature of the Scoreboard was the ability to see all challenges that you have already completed and how many points you received for them:

![score](/assets/img/ctf/cmdnctrl/Score.png)

However, I wish that there was a description that provided more details about where each flag came from. With 126 flags (yes 126 flags!) it is hard to keep track of what your team has already attempted.

Unlike other CTF Scoreboards (like root-the-box) CMD+CTRL does not allow you to manually type in a flag. Instead, the 2 challenges are tied to the scoreboard and when you would successfully accomplish a task, an api call was made back to the scoreboard which would give you points to the task you completed. This was very convenient!

## The Challenges

CMD+CTRL's challenges were some of the most fun challenges I encountered in a capture-the-flag. There was a wide array of SQL injection, XSS, Cipher challenges, and more. The challenges consisted of a fake Bank and a fake HR management site. I forgot to capture a screenshot of the HR site, but here is what the bank looked like:

![bank](/assets/img/ctf/cmdnctrl/ShadowBank.png)

Both sites were put together very well and contained a good amount of information and hints. I was a bit disappointed in the some of the point distribution for certain challenges. Some challenges would be very easy and worth a lot of point while others were difficult and were not worth a lot of points. However, it is difficult for the creators as certain tasks that might be easy for them would be difficult for the competitors.

Out of all of the challenges my favorite was the 2 cipher challenges. I was not aware of online cipher cracking software (like [this site](http://www.mygeocachingprofile.com/codebreaker.vigenerecipher.aspx)) until after I found out the first few letters of the key with good guessing and google searching. I was a bit disappointed that the cipher challenge was not worth a lot of points but if I used the online cracker from the beginning, it would have been a lot easier.

## Conclusion

Overall, the CMD+CTRL was one of the best CTFs I have competed in. I loved the simplicity of the scoring engine. The challenges were very well made and stable.

Word of advice to future competitors: treat all challenges as if you were actually hacking a bank or HR site. Think of what kind of things would you not want a bank to be able to do. Also, if you find a vulnerability in one part of the application, try it in other locations as well.

Congratulations to the second place winners @dflo16 and @merlinn31 and the third place winner svoid!

![Final Score](/assets/img/ctf/cmdnctrl/FinalScore.png)

