# Context Document for Amazon Q to Support ARC-JR Migration to Turborepo

This document provides context for Amazon Q to assist in migrating the ARC-JR project to a Turborepo monorepo structure. It outlines the necessary steps, considerations, and best practices for a successful migration.

## Migration Overview

## Context

This is a React custom SSR static site generated web application that serves my technical blog content. For more information on it's infrastructure and patterns, consult the following files:

<project-root>/README.md
<project-root>/.amazonq/rules/**/*.md

### Phase Based Approach

#### Phase One

Create a step by step guide to migrate this web-app to being a turborepo monorepo. Do not create any files or modify any files at this point. Analyze the repository and the steps laid out subsequently in this document and print your plan for approval by me before proceeding.

#### Phase Two

Create a directory `apps/web` to migrate the current web application source code into.
Outline what files will be moved where _before_ moving anything and request confirmation.
