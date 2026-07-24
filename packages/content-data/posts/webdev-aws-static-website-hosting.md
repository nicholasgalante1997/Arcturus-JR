---
title: ES6 SPA Continuous Deployment with AWS and Github Actions
date: '2025-04-17'
excerpt: In this article, we'll cover scaffolding a CICD pipeline for a ESnext SPA and hosting it on AWS.
tags:
  - javascript
  - aws
  - github actions
  - cicd
  - spa
image:
  src: /assets/doodles-marketplace.avif
  alt: Doodles nft cards for sale in a marketplace fashion
  aspectRatio: 16 / 9
category: SOFTWARE ENGINEERING
subcategory: Amazon Web Services
searchTerms:
  - Web Development
  - Javascript
  - AWS
  - Github Actions
  - CICD
  - SPA
readingTime: 30 minutes
visible: false
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