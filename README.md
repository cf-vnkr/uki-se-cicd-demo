# UKI SE demo blog

This project is created for CI/CD demo purposes for UKI SEs.

> [!IMPORTANT]
> If you weren't assigned an issue when you joined the repo have a look - maybe there's an issue waiting for you.


## Adding a blog post

### Prerequisites

- Have a GitHub account with configured SSH keys
- Have Git installed on your machine
- (Optional) Have VSCode installed

### Steps

1. Clone this project
2. Create a new git branch
3. Write a blog post in `.md` format in `src/content/blog` using the below template:

```md
---
title: Merry Christmas
description: Seasonal greetings from Santa Claus
pubDate: 2026-12-25
author: Santa Claus
tags: [astro, cloudflare, christmas, greetings]
---

# Merry Christmas

Let there be joy and celebration!
```
4. Commit the changes and push to the remote repository
5. Create a pull request to the main branch.
6. If tests pass, wait for approval. Once merged head to [UKI SE demo blog](https://uki-blog.cfdemo.site) to see your post.
