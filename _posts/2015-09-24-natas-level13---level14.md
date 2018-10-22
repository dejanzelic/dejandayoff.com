---
layout: post
title: "Natas Level13 - Level14"
date: 2015-09-24 22:28:30
description:
tags: Natas CTF
categories: Natas
twitter_text:
---
Natas 13 looks very similar to natas12.

![Screenshot1](/assets/img/screenshots/Natas_level13-1.png)

Let look at the source to see if we can find any differences:

    <html>
    <head>
    <!-- This stuff in the header has nothing to do with the level -->
    <link rel="stylesheet" type="text/css" href="http://natas.labs.overthewire.org/css/level.css">
    <link rel="stylesheet" href="http://natas.labs.overthewire.org/css/jquery-ui.css" />
    <link rel="stylesheet" href="http://natas.labs.overthewire.org/css/wechall.css" />
    <script src="http://natas.labs.overthewire.org/js/jquery-1.9.1.js"></script>
    <script src="http://natas.labs.overthewire.org/js/jquery-ui.js"></script>
    <script src=http://natas.labs.overthewire.org/js/wechall-data.js></script><script src="http://natas.labs.overthewire.org/js/wechall.js"></script>
    <script>var wechallinfo = { "level": "natas13", "pass": "<censored>" };</script></head>
    <body>
    <h1>natas13</h1>
    <div id="content">
    For security reasons, we now only accept image files!<br/><br/>

    <? 

    function genRandomString() {
        $length = 10;
        $characters = "0123456789abcdefghijklmnopqrstuvwxyz";
        $string = "";    

        for ($p = 0; $p < $length; $p++) {
            $string .= $characters[mt_rand(0, strlen($characters)-1)];
        }

        return $string;
    }

    function makeRandomPath($dir, $ext) {
        do {
        $path = $dir."/".genRandomString().".".$ext;
        } while(file_exists($path));
        return $path;
    }

    function makeRandomPathFromFilename($dir, $fn) {
        $ext = pathinfo($fn, PATHINFO_EXTENSION);
        return makeRandomPath($dir, $ext);
    }

    if(array_key_exists("filename", $_POST)) {
        $target_path = makeRandomPathFromFilename("upload", $_POST["filename"]);


            if(filesize($_FILES['uploadedfile']['tmp_name']) > 1000) {
            echo "File is too big";
        } else if (! exif_imagetype($_FILES['uploadedfile']['tmp_name'])) {
            echo "File is not an image";
        } else {
            if(move_uploaded_file($_FILES['uploadedfile']['tmp_name'], $target_path)) {
                echo "The file <a href=\"$target_path\">$target_path</a> has been uploaded";
            } else{
                echo "There was an error uploading the file, please try again!";
            }
        }
    } else {
    ?>

    <form enctype="multipart/form-data" action="index.php" method="POST">
    <input type="hidden" name="MAX_FILE_SIZE" value="1000" />
    <input type="hidden" name="filename" value="<? print genRandomString(); ?>.jpg" />
    Choose a JPEG to upload (max 1KB):<br/>
    <input name="uploadedfile" type="file" /><br />
    <input type="submit" value="Upload File" />
    </form>
    <? } ?>
    <div id="viewsource"><a href="index-source.html">View sourcecode</a></div>
    </div>
    </body>
    </html>
    
Looks like the biggest difference is that exif_imagetype is run to check the file type. Let look more at what this method does:

exif_imagetype() reads the first bytes of an image and checks its signature. Source: http://php.net/manual/en/function.exif-imagetype.php

Intresting... since it's only the first few bytes I bet we can just change the first few bytes to a jpg's magic numbers and it would work. A quick Google search shows that:

            File type	          Typical extension	  Hex digits xx = variable
    JPEG File Interchange Format	        jpg	                ff d8 ff e0
    
Lets open up our file in a hex editor and make the changes to the readFile.php file we used in the last challenge:

![Screenshot2](/assets/img/screenshots/Natas_level13-2.png)
    
Not I'll upload it and see if it worked:

![Screenshot4](/assets/img/screenshots/Natas_level13-4.png) 
    
Got it! Don't forget to also change the filename hidden field as we did in the last challenge too!

Lg96M10TdfaPyVBkJdjymbllQ5L6qdl1

