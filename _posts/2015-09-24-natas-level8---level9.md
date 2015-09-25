---
layout: post
title: "Natas Level8 - Level9"
date: 2015-09-24 22:26:35
image: '/assets/img/'
description:
tags: Natas CTF
categories: Natas
twitter_text:
---
Looks like natas8 is another "secret input" challenge. We'll start by jumping right into the source code.

    <html>
    <head>
    <!-- This stuff in the header has nothing to do with the level -->
    <link rel="stylesheet" type="text/css" href="http://natas.labs.overthewire.org/css/level.css">
    <link rel="stylesheet" href="http://natas.labs.overthewire.org/css/jquery-ui.css" />
    <link rel="stylesheet" href="http://natas.labs.overthewire.org/css/wechall.css" />
    <script src="http://natas.labs.overthewire.org/js/jquery-1.9.1.js"></script>
    <script src="http://natas.labs.overthewire.org/js/jquery-ui.js"></script>
    <script src=http://natas.labs.overthewire.org/js/wechall-data.js></script><script src="http://natas.labs.overthewire.org/js/wechall.js"></script>
    <script>var wechallinfo = { "level": "natas8", "pass": "<censored>" };</script></head>
    <body>
    <h1>natas8</h1>
    <div id="content">

    <?

    $encodedSecret = "3d3d516343746d4d6d6c315669563362";

    function encodeSecret($secret) {
        return bin2hex(strrev(base64_encode($secret)));
    }

    if(array_key_exists("submit", $_POST)) {
        if(encodeSecret($_POST['secret']) == $encodedSecret) {
        print "Access granted. The password for natas9 is <censored>";
        } else {
        print "Wrong secret";
        }
    }
    ?>

    <form method=post>
    Input secret: <input name=secret><br>
    <input type=submit name=submit>
    </form>

    <div id="viewsource"><a href="index-source.html">View sourcecode</a></div>
    </div>
    </body>
    </html>
    
So it looks like they tried to hide the secret by encoding the input in the following order:

    1) base64_encode - Regular Base64 encoding
    2) strrev - reverses a string
    3) bin2hex - Convert binary data into hexadecimal representation
    
They also gave us the final output which is "3d3d516343746d4d6d6c315669563362". We simply need to run this string through the following proccess:

    1) hex2bin
    2) strrev
    3) base64_decode
    
An easy way of testing this is by running:

    php -a 
    
This will open and interactive php command line when you don't want to create php files just to run a quick test. 
![Screenshot1](/assets/img/screenshots/Natas_level8-1.png)
    
This gives us the input string of:
    oubWYf2kBq
    
After that, we get our answer:
![Screenshot2](/assets/img/screenshots/Natas_level8-2.png)
    
W0mMhUcRRnG8dcghE4qvk3JA9lGt8nDl


