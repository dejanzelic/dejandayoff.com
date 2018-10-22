---
layout: post
title: "Natas Level11 - Level12"
date: 2015-09-24 22:28:09
description:
tags: Natas CTF
categories: Natas
twitter_text:
---
Natas11 seems to be a new kind of challenge. Let look at what it does:

![Screenshot1](/assets/img/screenshots/Natas_level11-1.png)
    
Looks like you can change the background color. Just to try it lets change the background to black (#000000):

![Screenshot2](/assets/img/screenshots/Natas_level11-2.png)
    
Nothing vulnerable sticks out. Lets take a look at the source:

    <html>
    <head>
    <!-- This stuff in the header has nothing to do with the level -->
    <link rel="stylesheet" type="text/css" href="http://natas.labs.overthewire.org/css/level.css">
    <link rel="stylesheet" href="http://natas.labs.overthewire.org/css/jquery-ui.css" />
    <link rel="stylesheet" href="http://natas.labs.overthewire.org/css/wechall.css" />
    <script src="http://natas.labs.overthewire.org/js/jquery-1.9.1.js"></script>
    <script src="http://natas.labs.overthewire.org/js/jquery-ui.js"></script>
    <script src=http://natas.labs.overthewire.org/js/wechall-data.js></script><script src="http://natas.labs.overthewire.org/js/wechall.js"></script>
    <script>var wechallinfo = { "level": "natas11", "pass": "<censored>" };</script></head>
    <?

    $defaultdata = array( "showpassword"=>"no", "bgcolor"=>"#ffffff");

    function xor_encrypt($in) {
        $key = '<censored>';
        $text = $in;
        $outText = '';

        // Iterate through each character
        for($i=0;$i<strlen($text);$i++) {
        $outText .= $text[$i] ^ $key[$i % strlen($key)];
        }

        return $outText;
    }

    function loadData($def) {
        global $_COOKIE;
        $mydata = $def;
        if(array_key_exists("data", $_COOKIE)) {
        $tempdata = json_decode(xor_encrypt(base64_decode($_COOKIE["data"])), true);
        if(is_array($tempdata) && array_key_exists("showpassword", $tempdata) && array_key_exists("bgcolor", $tempdata)) {
            if (preg_match('/^#(?:[a-f\d]{6})$/i', $tempdata['bgcolor'])) {
            $mydata['showpassword'] = $tempdata['showpassword'];
            $mydata['bgcolor'] = $tempdata['bgcolor'];
            }
        }
        }
        return $mydata;
    }

    function saveData($d) {
        setcookie("data", base64_encode(xor_encrypt(json_encode($d))));
    }

    $data = loadData($defaultdata);

    if(array_key_exists("bgcolor",$_REQUEST)) {
        if (preg_match('/^#(?:[a-f\d]{6})$/i', $_REQUEST['bgcolor'])) {
            $data['bgcolor'] = $_REQUEST['bgcolor'];
        }
    }

    saveData($data);



    ?>

    <h1>natas11</h1>
    <div id="content">
    <body style="background: <?=$data['bgcolor']?>;">
    Cookies are protected with XOR encryption<br/><br/>

    <?
    if($data["showpassword"] == "yes") {
        print "The password for natas12 is <censored><br>";
    }

    ?>

    <form>
    Background color: <input name=bgcolor value="<?=$data['bgcolor']?>">
    <input type=submit value="Set color">
    </form>

    <div id="viewsource"><a href="index-source.html">View sourcecode</a></div>
    </div>
    </body>
    </html>

So it looks like when the input comes in the first it will check if a cookie exists. If the cookie does not exist, the code will load the defaults ("showpassword"=>"no", "bgcolor"=>"#ffffff"). If the cookie does exist, the background color value will change in the array. Then the next method that is run is saveData() which:

    1) json_encodes the array
    2) xor_encrypts the json data
    3) base64_encodes the xor
    
That base64 data is then set as the cookie. 

One thing that catches my eye is the value "showpassword" in the array. It looks like if we cahnge "showpassword" to "yes " from "no" the app will display the password. Lets look at what happens when we json_encode that string. Once again we will turn to our interactive php command line and we will use values straight from the source code:
 
    php > $defaultdata = array( "showpassword"=>"no", "bgcolor"=>"#ffffff");
    php > echo json_encode($defaultdata);
    {"showpassword":"no","bgcolor":"#ffffff"}
    
As suspected, it just returns the array in JSON format. One thing that you need to know about XOR is:

    Clear_text ⊕ key = Cipher_text
    Cipher_text ⊕ key = Clear_text
    Clear_text ⊕ Cipher_text = key
    
Here is the information that we do have:

    1) Cipher_text - in the form of the cookie
    2) Clear_text - from the source code
    
according to this, we should be able to get the key. First lets get our cookie:

![Screenshot3](/assets/img/screenshots/Natas_level11-3.png)
    
    1) Cipher_text = base64_decode(ClVLIh4ASCsCBE8lAxMacFMZV2hdVVotEhhUJQNVAmhSRwh6QUcIaAw=)
    2) Clear_text = {"showpassword":"no","bgcolor":"#000000"} 
        (NOTE: since we changed our bgcolor to black make sure you update the value to reflect that.
    
Now we have to XOR these 2 together. For this, let use the the function they already gave us but with a small change:

    function xor_encrypt($in, $key) {
        $text = $in;
        $outText = '';

        // Iterate through each character
        for($i=0;$i<strlen($text);$i++) {
        $outText .= $text[$i] ^ $key[$i % strlen($key)];
        }

        return $outText;
    }
    
So when we run:

    echo  xor_encrypt(base64_decode('ClVLIh4ASCsCBE8lAxMacFMZV2hdVVotEhhUJQNVAmhSRwh6QUcIaAw='),'{"showpassword":"no","bgcolor":"#000000"}');
    
we get the following output:

    qw8Jqw8Jqw8Jqw8Jqw8Jqw8Jqw8Jqw8Jqw8Jqw8Jq
    
That means the key that is used to XOR the cookie is:
    
    qw8J

Now lets take that key, xor the values we want to use, and use that as our cookie. We will want a cookie that contains the following values:

    {"showpassword":"yes","bgcolor":"#000000"}
    
    
Now lets run:

    echo base64_encode(xor_encrypt('{"showpassword":"yes","bgcolor":"#000000"}', 'qw8J'));

We get the following output:
    ClVLIh4ASCsCBE8lAxMacFMOXTlTWxooFhRXJh4FGnBTVAh6QUcIelMK
    
Now lets use that as our cookie and see what happens:

![Screenshot4](/assets/img/screenshots/Natas_level11-4.png)
    
Got it!

EDXp0pS26wLKHZy1rDBPUZk0RKfLGIR3
