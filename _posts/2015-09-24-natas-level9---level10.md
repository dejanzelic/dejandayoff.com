---
layout: post
title: "Natas Level9 - Level10"
date: 2015-09-24 22:27:52
image: '/assets/img/'
description:
tags: Natas CTF
categories: Natas
twitter_text:
---
Natas9 looks like a new type of challenge. The only thing on the screen is a text box and a search button.

![Screenshot1](/assets/img/screenshots/Natas_level9-1.png)
To try it out, I searched for the string "test" and got the following output:
![Screenshot2](/assets/img/screenshots/Natas_level9-2.png)

And it looks like it does what it says it does! Lets look at the source code:

    <html>
    <head>
    <!-- This stuff in the header has nothing to do with the level -->
    <link rel="stylesheet" type="text/css" href="http://natas.labs.overthewire.org/css/level.css">
    <link rel="stylesheet" href="http://natas.labs.overthewire.org/css/jquery-ui.css" />
    <link rel="stylesheet" href="http://natas.labs.overthewire.org/css/wechall.css" />
    <script src="http://natas.labs.overthewire.org/js/jquery-1.9.1.js"></script>
    <script src="http://natas.labs.overthewire.org/js/jquery-ui.js"></script>
    <script src=http://natas.labs.overthewire.org/js/wechall-data.js></script><script src="http://natas.labs.overthewire.org/js/wechall.js"></script>
    <script>var wechallinfo = { "level": "natas9", "pass": "<censored>" };</script></head>
    <body>
    <h1>natas9</h1>
    <div id="content">
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
        passthru("grep -i $key dictionary.txt");
    }
    ?>
    </pre>

    <div id="viewsource"><a href="index-source.html">View sourcecode</a></div>
    </div>
    </body>
    </html>

I see that the code uses grep.

    grep -i $key dictionary.txt
    
This makes me thing that this will be a command injection vulnerability. We know that all the passwords are stored in: /etc/natas_webpass/ and we know that grep will search an input file for a given string pattern. We can also check that input is not sanitized by inputing "--help" into the search box and this should output the grep help screen:

![Screenshot3](/assets/img/screenshots/Natas_level9-3.png)
    
So our command to output the password should look something like:

    grep . /etc/natas_webpass/natas10
    
However, we only have control of whats placed in the $key variable. So our command should look like:

    grep -i . /etc/natas_webpass/natas10 dictionary.txt
    
This isn't an issue because -i just says the search string is case insensitive and the dictionary.txt will just be output but out result will be first. after inputing this, I get the following result:

![Screenshot4](/assets/img/screenshots/Natas_level9-4.png)

And as you can see, the first output is the password we are looking for:

nOpp1igQAkUzaI1GUUjzn1bFVj7xCNzu

