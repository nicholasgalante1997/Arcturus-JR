# PROJECT ARCTURUS

> _["Not the Dallas Cowboys, but it's a start."](https://www.reddit.com/r/TheSimpsons/comments/nixdx/project_arcturus_couldnt_have_succeeded_without/)_

[![license](https://img.shields.io/github/license/nicholasgalante1997/Arcturus-JR.svg)](LICENSE)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

## Table of Contents

- [Background](#background)
- [Install](#install)
- [Usage](#usage)
- [API](#api)
- [Contributing](#contributing)
- [License](#license)

## Background

This was originally an extremely tiny blog microsite powered by vanilla es6, marked, and import maps; hosted on AWS through S3, Cloudfront, Route53 Access Zone and costing me ultimately under $0.52 monthly. It did not have a bundler. It had maybe 4 dependencies. It was objectively gorgeous, and a flirty love letter to how far modern browsers have come, and how affordable small microsites could be.

It specifically did not leverage React/JSX, a conscious decision that not every web development project needs to be synonymous with React. We all use React every day at work, and that has jaded me to some degree with it. Maybe it's the propensity that enterprise React codebases seem to hurtle themselves with towards unchecked bloat (dependency, bundle output, source code file system). Maybe it's the unending onslaught of junior developers that never learned proper web development fundamentals, but learned React and learned CSS in JS solutions. Maybe it's the mortifying way React has steered it's public identity towards vehement adoption of _frameworks_. You either die a hero, or you live long enough to see yourself become the villain.

In any case, I had committed to not using React here. But then something hit me, and I've had a renewed vigor to challenge my own distaste. React codebases can be beautiful. They can be clean, readable, modular and sustainable. If I'm struck by lightning, you should be able to keep this blog alive without banging your head too hard against a wall. That's the new goal. A scalable, readable React architecture that makes no compromises on performance, developer experience, or simplicity.

If you made it to the end of this diatribe, you deserve something. You won't get anything, but just know you deserve it.

## Install

### Cloning with `git`

> As a best practice, you should fork this repo before making edits. So if you do subscribe to this practice, your git url will look different than below.

```bash
git clone git@github.com:nicholasgalante1997/Arcturus-JR.git
```

### Installing dependencies

This package uses `[bun](https://bun.sh/)` for dependency management.

```bash
bun install
```

## Usage

### Component development

I primarily will use Storybook for component development. 

```
```

Note: The `license` badge image link at the top of this file should be updated with the correct `:user` and `:repo`.

### Any optional sections

## API

### Any optional sections

## More optional sections

## Contributing

See [the contributing file](CONTRIBUTING.md)!

PRs accepted.

Small note: If editing the Readme, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

### Any optional sections

## License

[MIT © Richard McRichface.](../LICENSE)
