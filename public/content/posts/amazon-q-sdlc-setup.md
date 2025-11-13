The other day, had the inkling that I wasn't getting the most out of amazon q, and admittedly I get a lot out of amazon q these days.

The documentation, like most amazon documentation, was frustratingly pristine. _Why do we not all write documentation like this?_ But, I can similarly understand if you do not want to sit down and read it all. It can be, at times, verbose.  

I'm not going to attempt to cover it all here, but things what we cover within this guide can be better understood, and expanded upon, by principles available within the documentation. So to that effect, I am leaving several links down below, for your more in depth reading should it spark your interest:

* [Amazon Q Developer Docs](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/what-is.html)
* [Amazon Q CLI Docs](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/command-line.html)
* [Amazon Q CLI Source Code](https://github.com/aws/amazon-q-developer-cli)
* [Amazon Q CLI Supplementary Documentation](https://github.com/aws/amazon-q-developer-cli/blob/main/docs/introduction.md)

### A Short Diatribe From a Mad Developer Re: Vibe Coding

> You don't need to read this if you're a software engineer. It's a little preachy.

Before we get into it, I want to ramble in a small preamble. I've thought long about the right way to convey this so as to not lose the severity of the message. I think maybe saying it plainly is best.  

**Vibe coding is unethical. This is not a guide to support your fevered delusions that you can vibe code yourself a platform of substance. You cannot. It is unethical for you to try to do so. There are multi billion dollar companies with some of the most phenomenal competent software engineers on the planet, and at those companies there are still security vulnerabilities and exploitable bugs that have led to harm for end users. Windows/Microsoft has been responsible for one of the most dangerous exploit vectors in the history of the planet with [Eternal Blue](https://www.cisecurity.org/wp-content/uploads/2019/01/security-primer-eternalblue) and I promise you, _your vibe coded app is not nearly as secure as microsoft_. Even if we're comparing apples to blue oranges, if you are unaware of the vectors through which you will be exploited, you cannot reasonably defend against them, only accidentally.**

## Prerequisites

You should have amazon q cli installed. If you do not, you can follow the [guide here](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/command-line-installing.html) to install it.

## Amazon Q Workspace Setup

Amazon Q's efficiency with a given task is correlated to some degree to it's access to the context necessary to reduce the task to a deterministic output/action. Amazon Q looks for context in deterministic locations.

There are two locations that **amazonq** will look for context without additional configuration- a global directory, and then within the local project directory.

### Global Configuration

The global amazonq cli context directory is located at `~/.aws/amazonq/`. This global context directory is intended to contain contexts that are to be used **across projects**. From the supplemental documentation, it appears that amazon q is moving away from this pattern, but does support it currently.

### Project Configuration

The local project amazonq cli context directory is located at `./.amazonq/` within your project directory. This local context directory is intended to contain contexts that are to be used **within a specific project**. This ends up being extremely useful for engaging in productive sessions with q.

By default, the "Default Agent" (which is the agent you work with when you run `q chat` with no provided arguments)

<a href="/docs/amazon-q-spec-meta.md" download="amazon-q-spec-meta.md" target="_blank" rel="noreferrer">Download Amazon Q Spec Meta</a>

