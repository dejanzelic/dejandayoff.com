---
layout: post
title: "NoBots - AppSec USA 2018 CTF Solution"
date: 2019-01-29 20:18:30
image: '/assets/img/'
description: Official solution for AppSec USA's NoBots CTF challenge.
tags: CTF AppSecUSA
categories: CTF
twitter_text: Official solution for AppSec USA's NoBots CTF challenge.
---

# Running the challenge
```bash
docker run -p 5050:80 -e SECRET_KEY="YourSecretKey" -e SITE_KEY="YourSiteKey" dejandayoff/nobots
```
Using a browser, visit http://localhost:5050 (do not visit 127.0.0.1:5050, the domain must be localhost)

The SECRET_KEY and SITE_KEY are required if you want to run the second challenge with Google reCAPTCHA. This only takes a minute to set up: 

 1. Go to https://www.google.com/recaptcha/admin
 2. Fill out "Register a new site" section with the following information:
  ![reCAPTCHA parameters](/assets/img/nobots/captcha.png)
 3. Add your secret key and site key to the docker command above.

# Solution
The challenge is to automate the action that is being blocked by the CAPTCHA. This ranges from collecting free items to brute forcing a login. All these changes are possible with the curl command and do not require Burp or any other proxy.

## NobotCoin
When a new captcha image is loaded, the captcha for the user's session is reset. If you never load the image, the captcha for the users session will not change. To exploit, simply load the request in burp (or copy the request with curl), do not load the image again, and bruteforce the input.

`flag{YouAreRich!Well...MaybeNot...ButSoon}`

### Code
```php
if($_POST['challenge'] == "captcha1"){  
  if ($_SESSION['ttcapt'] == $_POST['captcha']){  
	  echo "It's ordered, you should get your NobotCoin Soon!";  
	  if(!isset($_SESSION['coin_quant'])){  
		  $_SESSION['coin_quant'] = 1;  
	  }else{  
		  $_SESSION['coin_quant'] = $_SESSION['coin_quant'] + 1;  
	  }  
	  echo('<br>');  
	  echo("You have currently ordered " . $_SESSION['coin_quant'] . " coins");  
	  echo("<br>");  
	  
	  }else {  
		  echo "No automating to steal coins!";  
		  echo("<br>");  
	  }  
}  
  
if($_SESSION['coin_quant'] > 500){  
  echo("flag{YouAreRich!Well...MaybeNot...ButSoon}");  
  echo("<br>");  
}
```

## Free Stickers!
The reCAPTCHA is 100% a real reCAPTCHA v2 service. However, the challenge is not to exploit reCAPTCHA. The reCAPTCHA is poorly implemented and if the `g-recaptcha-response` field is not in the request, the captcha will not be evaluated and the application fails open.
    
To exploit this, capture the request in a proxy (or copy to curl) and remove the `g-recaptcha-response`  parameter completely from the request. With this removed it is possible run intruder (or a scripted curl request) and obtain the flag.

`flag{WeDropShipFromMars}`

### Code
```php
if($_POST['challenge'] == "captcha2"){  
  $validCaptcha = true;  
  if(isset($_POST['g-recaptcha-response'])) {  
	  // RECAPTCHA SETTINGS  
	  $captcha = $_POST['g-recaptcha-response'];  
	  $ip = $_SERVER['REMOTE_ADDR'];  
	  $key = getenv('SECRET_KEY');  
	  $url = 'https://www.google.com/recaptcha/api/siteverify';  
  
	  // RECAPTCH RESPONSE  
	  $recaptcha_response = file_get_contents($url.'?secret='.$key.'&response='.$captcha.'&remoteip='.$ip);  
	  $data = json_decode($recaptcha_response);  
  
	  if(isset($data->success) && $data->success === true) {  
		  $validCaptcha = true;  
	  }  
	  else {  
		  $validCaptcha = false;  
	  }  
  }  
  if($validCaptcha){  
	  if(!isset($_SESSION['sticker_quant'])){  
		  $_SESSION['sticker_quant'] = 1;  
	  }else{  
		  $_SESSION['sticker_quant'] = $_SESSION['sticker_quant'] + 1;  
	  }  
	  echo("Your order has been placed. Shipping can take 2 days to 3 years.");  
	  echo("<br>");  
	  echo("You have currently ordered " . $_SESSION['sticker_quant']);  
	  echo("<br>");  
  }else{  
	  echo("Ha! bad captcha ya fool!");  
  }  
}  
if($_SESSION['sticker_quant'] > 500){  
  echo("flag{WeDropShipFromMars}");  
  echo("<br>");  
}  
```
## Free Gift Card!
This CAPTCHA challenge is designed to teach participants about poor random implementations. There are only 10 possible captchas that a user could get. To exploit this, the first step is to collect all possible CAPTCHA images. Once the images are collected, the next step is to write a script that correlates the 10 images to actual captcha code.
    
### CAPTCHA Solutions
#### Image:
```
iVBORw0KGgoAAAANSUhEUgAAADYAAAAjAgMAAACiMBFmAAAACVBMVEUA/wAAAAAAAP+IKgCrAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAnElEQVQokZWRMQ4EIQhFCdWGk5A5BUeggPuYPQmZynjKBXWLqSYSmi8+kQ+4u7qaW6YoHIVLYib5hKgdsokmJSbFy9ttBhwAAYx9ScKGAZ1oyaxRYGdsJTtg4yBe8iK4IIKZaFaT/LbUeG8J9+hjAP5lVKPPZmke8G7UH994Rg4ipjlW5bmTUlzaaHrKTtBrkfru5DMSlNq/zHX8AGLBOvfkU/oKAAAAAElFTkSuQmCC
```
#### Solution: b3449
#### Image:
```
iVBORw0KGgoAAAANSUhEUgAAADYAAAAjAgMAAACiMBFmAAAACVBMVEUA/wAAAAAAAP+IKgCrAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAm0lEQVQokZWRMQ4EIQhFCSUnIXMKjkCh9zGWcwpiNfGU+zXj7mSrkUJ9CR/kQ2Y5ebLsKeFBW2H5F76rdYjM0R1t7ZVEqF/EZeFRgh4YsZA79Vq0BbeBwrW0opeKzGTkAEl0Jkuv/YHK56gUC+XkOIreWmn1CiG5K/9NNOzAVNOVdxN9w4cTOLAI3HtauDiVnva34Pi0GQqM7dsHtpM+F6/Gd9EAAAAASUVORK5CYII=
```
#### Solution: aa05d
#### Image:
```
iVBORw0KGgoAAAANSUhEUgAAADYAAAAjAgMAAACiMBFmAAAACVBMVEUA/wAAAAAAAP+IKgCrAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAn0lEQVQokZWRsQ0EIQwELUJXgq4Kl+Bg3Q8i/Cqsj15UeQt/d8EnL0yAV2JYWIvBA+EWXOayVREgBYBkbLKOgJuDZPh/NqX0kWOwYZUU7U1Ey2dKTTmWVL0Ov/urSa2lLVl6z5S8pXJn/8iRUlVuSaNWqzxXlZaEL6NBebSU7zN+fhSrHA6E7aURzG+mOTdsT4FZcgrTf5flCIyYTX/zEwcPPSgIghtYAAAAAElFTkSuQmCC
```
#### Solution: 14570
#### Image:
```
iVBORw0KGgoAAAANSUhEUgAAADYAAAAjAgMAAACiMBFmAAAACVBMVEUA/wAAAAAAAP+IKgCrAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAlElEQVQokZVRwQ0EIQgkvi5UYq6KKYGH9LOlmHsZq9wBc8l5n42aIEMYQEbcYN5gzXlNjg6QLDd3nHLdoi2S3/CY3qWK8i1Dlh3ypqMRo2Vg0qnlWjaSdWywquoP7FI+G5RMZsEFXwlZ98tdY5R5za5jjfH3IzQ4uE3D8SYbN5nHHPa8jb1vNLTQgjqcq0D9Y2j2txs3xDLSZZdxtgAAAABJRU5ErkJggg==
```
#### Solution: 011c9
#### Image:
```
iVBORw0KGgoAAAANSUhEUgAAADYAAAAjAgMAAACiMBFmAAAACVBMVEUA/wAAAAAAAP+IKgCrAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAl0lEQVQokZWRsQ3FIAxELUomQUzBCC7sfVDKTGGlQkz5z4ZfpIq4wuhJHAcHqShz08bCGHQkha+5TXHCoVcUgQhvWOXTW2cvlMkIw5X6oOpYF16DpuMMzOSbH0t3YAkcJS+vBVoueZ20ERFh3biCCm3vH9Ps0x7b13iJRSHmeNRpkyJeSPNP+G7jLYRpNMly7EWi9x9u5R9e4zOyflzTIgAAAABJRU5ErkJggg==
```
#### Solution: 711b4
#### Image:
```
iVBORw0KGgoAAAANSUhEUgAAADYAAAAjAgMAAACiMBFmAAAACVBMVEUA/wAAAAAAAP+IKgCrAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAnklEQVQokZWRMQoEMQhFJaWnmDLkFB7BQu8TpswpZKowp9yfcdkttlgSJPjAzxc/mbmIuJuru9LWe0RmYvh1V7s0bnB26P+OB93UOkd9qMxy9ohaE5mZrn4EJ9YygAScied5jV5b48Q+rwgeaBIxXIkTmcvC440fo9R+15i/K6oLTmmmsprNa0CihhQMtXlJQYIIYjnrrnbZIQF9ktQX1vg9+OptbO8AAAAASUVORK5CYII=
```
#### Solution: 0969b
#### Image:
```
iVBORw0KGgoAAAANSUhEUgAAADYAAAAjAgMAAACiMBFmAAAACVBMVEUA/wAAAAAAAP+IKgCrAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAnUlEQVQokZWRsQ0EIQwELUJXgr4Kl+DA2w8ivCrQRaer8hej158+eUEAjGC9sBb3QMDCuJrL1kidwYG52dMiwp2y4IT/vkNKb1KumlQuUaLqQlV5PbCWdvajqdRrYe99DN7RhQdL1Xvw2sL7bFVlIUvN0w/SqDy0+Yxv5Z8fzRyAyEA2kzTGgdkHYxy2p52eNATjZKR72mxderMV/gY6Njo1qQN/ygAAAABJRU5ErkJggg==
```
#### Solution: 04bfb
#### Image:
```
iVBORw0KGgoAAAANSUhEUgAAADYAAAAjAgMAAACiMBFmAAAACVBMVEUA/wAAAAAAAP+IKgCrAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAmklEQVQokZ1RwQ0EIQgkPqnEbBVTAg/ox1wlZF8bq1yEvUvudfF4KKMMowMBJhBTiwRCW6FYPFUR3eaiBE3FzH5zPdc5+Vp7K0jcObc3pDaqeNLh1ImL217De5xeBZnOsSqfW55n5g83m/QPbMO9R68SmjTH4U71jO8QFQCiqvEh7HgRbkBWhKHh56aTlkMIyT901+xzAtHDcANA+jcZsUyGgQAAAABJRU5ErkJggg==
```
#### Solution: 1ec73
#### Image:
```
iVBORw0KGgoAAAANSUhEUgAAADYAAAAjAgMAAACiMBFmAAAACVBMVEUA/wAAAAAAAP+IKgCrAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAnklEQVQokZVRsQ0EMQiLUjIJuikYwUXYB135U6Cvokx5kOS/+OqDoggXxmAXFTRtqiqtAeWokgXEDwT5jAuRkBXEkz+4Xka5bDZRtdfb3LNJSETlbZxNQq6vhORcbcL7du/MH2jdL3b6wpjJYyxIVIsb+x61hZiW0F6D+lrj5yKdTmgchlM3IoKGSAIZhZxxw8D0UGeKpylo0iTXjiAedkU9rbRmsPIAAAAASUVORK5CYII=
```
#### Solution: 099e0
#### Image:
```
iVBORw0KGgoAAAANSUhEUgAAADYAAAAjAgMAAACiMBFmAAAACVBMVEUA/wAAAAAAAP+IKgCrAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAoUlEQVQokZWRsQ3DMAwECZWcRPAUHIHFcx8ikxCuDE1pUnKKIEUiqzBO+hehfwJMcilUBUpbn6XZTNNtorLnBURhSLNBfnuDBh3erkUt2ssjmBdyMJ3e35jiidTGg83jYuLmC5mOPmp3YSdKMY8Hg8rbn9P85aAUFPLgEYen+PTvNCqJfI7ORPbS0DIjzQLstiCq1QPqij+S/Jyb06w6nEXeXEc6QXi8dz8AAAAASUVORK5CYII=
```
#### Solution: 129fa
    
`flag{IThinkIAteTooMuch...}`
 
### Code
```php
$captcha_array = [  
'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'];  
if($_POST['challenge'] == "captcha3"){  
  $solutions = [  
  'b3449',  
  'aa05d',  
  '14570',  
  '011c9',  
  '711b4',  
  '0969b',  
  '04bfb',  
  '1ec73',  
  '099e0',  
  '129fa'  
  ];  
  if(!is_null($_POST['captcha3']) && $_POST['captcha3'] == $solutions[$_SESSION['captcha3_captchaID']]){  
	  echo "<p>Your gift card is ordered!</p>";  
	  if(!isset($_SESSION['food_quant'])){  
		  $_SESSION['food_quant'] = 1;  
	  }else{  
		  $_SESSION['food_quant'] = $_SESSION['food_quant'] + 1;  
	  }  
	  echo "<p>You have ordered: " . $_SESSION['food_quant'] . " gift cards. </p>";  
  }else{  
	  echo "<p>Sorry, your captcha was wrong! Try again! </p>";  
  }  
}  
$captcha_id = rand(0, 9);  
$_SESSION['captcha3_captchaID'] = $captcha_id;  
  
if($_SESSION['food_quant'] > 500){  
  echo("flag{IThinkIAteTooMuch...}");  
  echo("<br>");  
}  
```
## Admin Login Only
The use of a CAPTCHA on a login page is often used to prevent brute forcing. However, the implementation of the Admin Login page uses a text based CAPTCHA that asks the user for the sum of 2 numbers. The solution for this one is fairly self-explanatory:

 1. Discover the username by manual (or automated) testing. (it's `admin`, so it really shouldn't take long :D)
 2. Create a script to parse the HTML, add the numbers, and append the solution to the `captcha4` parameter.
 3. Find a good wordlist to bruteforce the password. 

The script should report that the password is `iloveyou`. The `iloveyou` password is fairly high on any password list thats decent. The password field is also case insensitive. 

`flag{IReallyDoLoveYou<3}`

### Code
```php
if($_POST['challenge'] == "captcha4"){  
  if(!is_null($_POST['captcha4']) && $_POST['captcha4'] == $_SESSION['captcha4_sum']){  
	 if($_POST['user'] == 'admin'){  
		  if(strtolower($_POST['password']) == 'iloveyou'){  
			  echo "<p>flag{IReallyDoLoveYou<3}</p>";  
		  }else{  
		  echo "<p>Incorrect Password</p>";  
	 }  
	 }else{  
		 echo "<p>Incorrect User</p>";  
	  }  
	 }else{  
		  echo "<p>Sorry, your captcha was wrong! Try again! </p>";  
     }
}  
$number1 = rand(0, 100);  
$number2 = rand(0, 100);  
$sum = $number1 + $number2;  
$_SESSION['captcha4_sum'] = $sum;
```
