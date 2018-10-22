---
layout: post
title: "Natas Level6 - Level7"
date: 2015-09-24 22:26:22
description:
tags: Natas CTF
categories: Natas
twitter_text:
---
Natas6 includes a text box for us to input a "secret" into. I assume if we enter in the proper secret, the password for natas7 will be outputted. 

I first tried to enter in some gibberish and see what I get back:

![Screenshot1](/assets/img/screenshots/Natas_level6-1.png)

As expected, I get a "Wrong secret" error:

![Screenshot2](/assets/img/screenshots/Natas_level6-2.png)

Something else that is new to this level is the View Source option. Clicking this gives me the source code:

    <html>
    <head>
    <!-- This stuff in the header has nothing to do with the level -->
    <link rel="stylesheet" type="text/css" href="http://natas.labs.overthewire.org/css/level.css">
    <link rel="stylesheet" href="http://natas.labs.overthewire.org/css/jquery-ui.css" />
    <link rel="stylesheet" href="http://natas.labs.overthewire.org/css/wechall.css" />
    <script src="http://natas.labs.overthewire.org/js/jquery-1.9.1.js"></script>
    <script src="http://natas.labs.overthewire.org/js/jquery-ui.js"></script>
    <script src=http://natas.labs.overthewire.org/js/wechall-data.js></script><script src="http://natas.labs.overthewire.org/js/wechall.js"></script>
    <script>var wechallinfo = { "level": "natas6", "pass": "<censored>" };</script></head>
    <body>
    <h1>natas6</h1>
    <div id="content">

    <?

    include "includes/secret.inc";

        if(array_key_exists("submit", $_POST)) {
            if($secret == $_POST['secret']) {
            print "Access granted. The password for natas7 is <censored>";
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

it looks like the secret key is loaded when the following code is run:
    include "includes/secret.inc";
    
lets see what happens if we navigate to that page:

![Screenshot3](/assets/img/screenshots/Natas_level6-3.png)

That's interesting, the page is empty. But i guess it makes sense because this page is not a valid HTML page. Lets see what happens when we inspect the source:

![Screenshot4](/assets/img/screenshots/Natas_level6-4.png)

and there's the answer:

![Screenshot5](/assets/img/screenshots/Natas_level6-5.png)

after we enter out secrete key "FOEIUWGHFEEUHOFUOIU", we can get the password:

![Screenshot6](/assets/img/screenshots/Natas_level6-6.png)

7z3hEENjQtflzgnT29q7wAvMNfZdh0i9


