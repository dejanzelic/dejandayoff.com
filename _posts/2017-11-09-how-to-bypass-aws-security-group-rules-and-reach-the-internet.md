---
layout: post
title: "How To Bypass AWS Security Group Rules and Reach the Internet"
date: 2017-11-09 17:05:00
image: '/assets/img/aws_dns/'
description: Traffic destined to the AmazonProvidedDNS is traffic bound for AWS management infrastructure and does not egress via the same network links as standard customer traffic and is not evaluated by Security Groups.
tags: aws, DNS
categories:
twitter_text: Bypassing AWS Security Group Rules and Reaching the Internet
---

TL;DR
=====

Customers can utilize AWS' DNS infrastructure in VPCs (enabled by
default). Traffic destined to the AmazonProvidedDNS is traffic bound for
AWS management infrastructure and does not egress via the same network
links as standard customer traffic and is not evaluated by Security
Groups. Using DNS exfiltration, it is possible to exfiltrate data out of
an isolated network.

-------------

DNS exfiltration allows an attacker to bypass outbound firewall rules,
and exfiltrate data or perform command and control activity with an
external service, by only using the DNS protocol. In this case, DNS
Exfiltration can even be used to exfiltrate data out of an isolated VPC
if AWS' managed DNS infrastructure is not disabled.

DNS Exfiltration can occur when an internal DNS server is configured to
forward external requests to upstream DNS servers. AWS allows the use of
their preconfigured DNS infrastructure (named AmazonProvidedDNS) by
default in all VPCs. An attacker can utilize this channel to send and
receive data with servers outside of the allowed environment. AWS
Customers can mitigate this risk by using their own DNS server and
turning off the preconfigured use of Amazon's DNS infrastructure.

How DNS Works
=============

To understand how DNS Exfiltration work, it is necessary to understand
how DNS works. If you already know this, [click here to skip to the next
section.](#How_DNS_Exfiltration_Works)

In many organizations, a network will have port 53(DNS) outbound blocked
on the firewall and instead, would have an internal DNS server to
resolve external domains. That Internal DNS server would usually have
port 53 outbound open to a higher level DNS server for queries that the
internal one cannot resolve. Let's look at how a DNS server would find
the Domain "yo.dejandayoff.com" for the first time.

![DNS Arch](/assets/img/aws_dns/1_dns.png)

1. The computer first makes a request to the internal DNS server to find yo.dejandayoff.com.
2. The DNS Server must first resolve the location of the Top Level Domain ".com." To do this, the DNS server asks the Root server for the .COM DNS Server.
3. Since the domain we are looking up is yo.dejandayoff.com, the DNSserver needs to find the location of dejandayoff.com's name server
4. Once the nameserver is found, the DNS server makes a request askingfor the A record of yo.dejandayoff.com
5. The nameserver responds with the IP
6. The DNS Server responds to the client with the IP

Note: There might be other DNS servers involved (like your ISPs DNS
server and its upstream DNS server)

How DNS Exfiltration Works<a name="How_DNS_Exfiltration_Works"></a>
==========================

If an attacker can control the nameserver for a domain, it is possible
for them to log requests and craft response for any subdomain lookups.
While the nameserver must accept standard DNS protocol requests, what it
does with that data does not have to be standard.

To demonstrate this, let's say an internal disgruntled employee would
like to exfiltrate thousands of credit card numbers out of a production
network that has no access to the external internet. One option would be
to use DNS exfiltration where the SSNs are prepended to the domain
lookup. For example:

4012888888881881.123.0808.visa.yo.dejandayoff.com

When the nameserver for yo.dejandayoff.com receives this request, it can
simply log the request and respond with a random IP. The attacker can
even include multiple cards per request or compress and send encoded
data to minimize the amount of request that have to be sent. Regardless
of the method, by having an internal DNS server that resolves external
domains, an attacker has two-way-communication.

The options here are endless, an attacker can create a local http proxy
that communicates solely through DNS or even a local network interface
that can tunnel all types of traffic through DNS. In fact, there is a
tool that was built for this exact reason! <http://code.kryo.se/iodine/>

How can attackers use this in AWS?
==================================

DNS exfiltration is not a new concept and the solution is not a simple
one. In a non-AWS environment one option would be to block all outbound
DNS connections (if you don't care about usability). Another option
would be to whitelist domains that are allowed to be resolved. The
simplest mitigating control would be to monitor DNS logs for
abnormalities (frequency of requests to domain, size of request, etc.)

AWS allows the use of the AmazonProvidedDNS by allocating an IP in each
subnet (VPC IPv4 network range, plus two) to simplify building out an
architecture
(<http://docs.aws.amazon.com/AmazonVPC/latest/UserGuide/VPC_Subnets.html#VPC_Sizing>).
Administrators are only allowed to enable and disable the DNS
infrastructure in each subnet. Per VPC flow log documentation this
management traffic is not logged to the bucket where customers store
logs so they do not fill a customer's bucket. Requests made to
AmazonProvidedDNS are management traffic and do not egress via the same
network links as standard customer traffic and are not evaluated by
Security Groups. Here is an image of the default DNS configuration when
a VPC is created and its settings:

![Allow DNS by default](/assets/img/aws_dns/2_VPCDefaultConfig_allowDNS.png)

Typically in AWS to make an outbound connection, two pieces are
necessary:

1. A route to an internet gateway or a NAT device
2. A security group that allows outbound communications on that port

However, using the methods outlined above, an attacker can bypass these
restriction by using the AmazonProvidedDNS. To demonstrate this
vulnerability, I have created a network in where there is a public
subnet and private subnet. The public subnet's sole purpose is to be
able to ssh into the private subnet (bastion host). The Public subnet
does have an internet gateway (to facilitate the ssh into the bastion
host). The private subnet does not contain an internet gateway or NAT
(only the DNS IP that Amazon opens in ALL subnets by default). The
security group configuration on the host in the private subnet allows
for SSH in from the bastion host only and contains absolutely no
outbound rules. This network layout can be found below:

![Network Diagram](/assets/img/aws_dns/3_network_in_aws.png)

And the configurations can be found below:

### Public subnet route table:

![Public subnet route table](/assets/img/aws_dns/4_public_subnet_routetable.png)

### Private subnet route table:

![Private subnet route table](/assets/img/aws_dns/5_private_subnet_routetable.png)

### Private host inbound security groups:

![Private host inbound security groups](/assets/img/aws_dns/6_OnlyAllowBationHostInbound.png)

### Private host outbound security groups:

![Private host outbound security groups](/assets/img/aws_dns/7_DenyAllOutbound.png)

To prove that I was not able to connect to the outside internet, here is
the private server receiving network timeouts to dejandayoff.com.

![Network Timeout](/assets/img/aws_dns/8_NetworkTimeout.png)

Once the environment was set up I created another server in a separate
VPC that would run the iodined service. Next, the private server used
its iodine client to connect to the server:

![Iodine Connect](/assets/img/aws_dns/9_iodineConnect.png)

With iodine connected, I was able to create an ssh tunnel (through the
iodine DNS tunnel) to google.com on port 8080 using the following
command:

```bash
ssh -L 8080:google.com:443 10.53.53.2
```

(10.53.53.0/24 is the subnet of the iodine tunnel, 10.53.53.2 is the
iodine server that I can ssh to\
)

Doing a curl on https://127.0.0.1:8080 allows us to hit google's
server!!

![Accessing Google](/assets/img/aws_dns/10_access_google.png)
==================================================================

While in the image google responds with a redirect, the purpose of the
demonstration was to show that a server with no outbound rules and no
internet gateway was able to reach external sites. From here, an
attacker could freely transfer data from an "airgapped" system with no
detection.

Mitigation
==========

Fortunately, Amazon allows the user to disable the AmazonProvidedDNS in
the VPC settings. Once disabled, the user will have to create their own
DNS server in the network using whatever software they would like. From
here, the custom DNS server would be able log relevant data and
whitelist only necessary websites.
