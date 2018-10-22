---
layout: post
title: "Natas Level10 - Level11"
date: 2015-09-24 22:28:02
description:
tags: Natas CTF
categories: Natas
twitter_text:
---
Natas10 looks exactly the same as natas9 except that it warns us that:

    For security reasons, we now filter on certain characters

Intresting... Let's take a look at the source and see what they do differently:

    <html>
    <head>
    <!-- This stuff in the header has nothing to do with the level -->
    <link rel="stylesheet" type="text/css" href="http://natas.labs.overthewire.org/css/level.css">
    <link rel="stylesheet" href="http://natas.labs.overthewire.org/css/jquery-ui.css" />
    <link rel="stylesheet" href="http://natas.labs.overthewire.org/css/wechall.css" />
    <script src="http://natas.labs.overthewire.org/js/jquery-1.9.1.js"></script>
    <script src="http://natas.labs.overthewire.org/js/jquery-ui.js"></script>
    <script src=http://natas.labs.overthewire.org/js/wechall-data.js></script><script src="http://natas.labs.overthewire.org/js/wechall.js"></script>
    <script>var wechallinfo = { "level": "natas10", "pass": "<censored>" };</script></head>
    <body>
    <h1>natas10</h1>differently
    <div id="content">

    For security reasons, we now filter on certain characters<br/><br/>
    <form>
    Find words containing: <input name=needle><input type=submit name=submit value=Search><br><br>
    </form>


    Output:
    <pre>
    <?
    $key = "";

    if(array_key_exists("needle", $_REQUEST)) {
        $key = $_REQUEST["needle"];
    }

    if($key != "") {
        if(preg_match('/[;|&]/',$key)) {
            print "Input contains an illegal character!";
        } else {
            passthru("grep -i $key dictionary.txt");
        }
    }
    ?>
    </pre>

    <div id="viewsource"><a href="index-source.html">View sourcecode</a></div>
    </div>
    </body>
    </html>


It looks like the biggest difference is the following code:

    if(preg_match('/[;|&]/',$key))
    
Basically if your input contains the ";" or "&" character, you will get an error. 

In natas9, our input was:

    . /etc/natas_webpass/natas10
    
Which does not contain either of those characters. It looks like they were expecting a different answer for natas9... oops!

Lets see if this input works for natas10:

![Screenshot1](/assets/img/screenshots/Natas_level10-1.png)

Yup! I assume that for natas9 they were expecting something like:

    a /dev/null; cat /etc/natas_webpass/natas10;

Anyway, the password is:

U82q5TCMMQ9xuFoI3dYX61s7OZD9JKoK

 
 

