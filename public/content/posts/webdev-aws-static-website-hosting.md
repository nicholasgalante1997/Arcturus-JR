---
slug: "webdev-static-website-hosting"
visible: true
title: ""
description: "The pursuit of perfect software is the pursuit of perfect processes; and a bunch of other things you can say at parties to indicate that you believe progress is usually a snake eating its own tail."
---

## Hosting an ES6 Single Page App on AWS, and Setting Up CICD via Github Actions

Today, we're going to walk through creating a continuous integration/continuous deployment pipeline for a Vanilla ES6 Single Page Application using AWS. However, the approaches applied here to CICD and Website Hosting can be applied to any static website (think react, or vue).

As a prerequisite, if you are following along I will assume you have previously purchased a domain name, and that you have setup an AWS account.

The following is a high level overview of the process:

1. Create a repository on GitHub
2. Create an S3 bucket on AWS
3. Create a CloudFront distribution on AWS
4. Create a Hosted Zone on AWS
5. Updating Name Servers
6. Creating a Certificate Via ACM
7. Using that Certificate to Configure the CloudFront Distribution
8. Creating a route53 alias to the CloudFront Distribution
9. Creating a github action workflow to
   1. Lint, Test, and Build the application
   2. Sync our bundled files to our S3 bucket
   3. Invalidate our cloudfront distribution
   4. Check the status of our deployment

### 1. Create a repository on GitHub

### 2. Create an S3 bucket on AWS

### 3. Create a CloudFront distribution on AWS

### 4. Create a Hosted Zone on AWS

### 5. Updating Name Servers

### 6. Creating a Certificate Via ACM

### 7. Using that Certificate to Configure the CloudFront Distribution

### 8. Creating a route53 alias to the CloudFront Distribution

### 9. Creating a github action workflow for CICD