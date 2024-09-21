# next-markdown-template

<p align="center">
  <img src="./public/img/logo.svg" alt="Template logo" />
</p>

This is a customized implementation of markdown renderer utilizing remark plugins, rehype plugins and pyodide in nextjs framework. This repository is a replica of a peer repo [`react-markdown-template`](https://github.com/siraisisatoru/react-markdown-template) while transferring the framework and language from javascript to typescript caused dramatic performance improvement.

# Purpose of this template

I was planning to build my own wiki page that hosts privately. My goal was to have sort of Python code blocks and render the output under the code block. There are several approaches including but not limited to building a HEXO plugin to render the output or building a customized react app that I can have full control of the design.

To extend the idea of rendering markdown files in React which may be useful in some cases in general while no existing template is available for this, this project has been produced.

This project was built on Nextjs and decorated with Tailwind CSS and Daisyui.

# Live Demo

The under-developing demo is hosted on Vercel and can be accessed here [https://next-markdown-demo.vercel.app/](https://next-markdown-demo.vercel.app/)

-   [x] Frontpage [https://next-markdown-demo.vercel.app/](https://next-markdown-demo.vercel.app/)
-   [x] Markdown render samples [https://next-markdown-demo.vercel.app/Website%20page/Cheatsheet](https://next-markdown-demo.vercel.app/Website%20page/Cheatsheet)
-   [x] Page from markdown files (require login with github)
    -   [https://next-markdown-demo.vercel.app/coding_notes/algorithm_c](https://next-markdown-demo.vercel.app/coding_notes/algorithm_c)
    -   [https://next-markdown-demo.vercel.app/coding_notes/python_tutorials/python](https://next-markdown-demo.vercel.app/coding_notes/python_tutorials/python)

# Supported features

## System design

-   ✅ Dark theme, Light theme and follow OS theme switch
-   ✅ Device responsive design

## Routing

-   ✅ Create pages based on the posts within a customizable directory

## Rendering

-   ✅ General Markdown
-   ✅ Ketax math render
-   ✅ GitHub Flavored Markdown (GFM) render
-   ✅ p5 script render
-   ✅ Code syntax highlighting
-   ✅ Code execution result render (output only)
    -   ✅ Python (Pyodide client worker)
    -   ✅ CPP
-   ✅ React-kawaii character render
-   ✅ Image gallery render

## Advanced feature

-   ✅ Client side fuzzy search of markdown files
-   ✅ Authentication with Github account (utilise Authjs)

## Work in progress

-   🚧 React flow to draw and reproduce circuits

## Brief ideas

-   💭 Image processing using Sharp js
-   💭 Connect with database to store bookmarks 

# Notes

## Markdown file structure

This template aimed to build an automatically constructed wiki-liked react app. To achieve this, the routing was based on file structure within `./src` folder. By default, `react-route-dom` will create routes within `Notes` folder excluding `markdownCheatsheet.md` file.

```md
.
├── app
├── components
├── Notes
│ ├── coding_notes
│ │ ├── python_tutorials
│ │ │ ├── python ch1
│ │ │ │ └── ch1.md <- become `<base url>/coding_notes/python_tutorials/python%20ch1/ch1`
│ │ │ ├── python ch2
│ │ │ │ └── ch2.md <- become `<base url>/coding_notes/python_tutorials/python%20ch2/ch2`
│ │ │ └── python.md <- become `<base url>/coding_notes/python_tutorials/python`
│ │ └── algorithm_c.md <- become `<base url>/coding_notes/algorithm_c`
│ └── markdownCheatsheet.md
├── public
...
```

## CPP code block

The implementation of CPP worker (`components/utils/workers/cpp_worker`) and (`public/cpp_worker`) was adopted from [https://github.com/InfiniteXyy/playcode](https://github.com/InfiniteXyy/playcode).

## Markdown template

In the latest version, markdown YAML heading support has been added. The deading will define the title, date and many attributes that will be rendered. The template of the Markdown files is as follows:

```md
+=+=+=+
title: testing page
date: "2024-02-17 01:31:48"
exeCPP: false
exePYTHON: false
abstract: "This is the abstract of this individual post."
done: false
+=+=+=+

# Contents

# title

other texts
other text
```
 
# Usage

## Configure Github OAuth

This project by default using Github as the OAuth service provider. To get the authentication feature working, some initial setup is needed. Please follow the [official guide to configure Github for OAuth](https://authjs.dev/guides/configuring-github#creating-an-oauth-app-in-github).

> [!IMPORTANT]
> This process will be required twice for two different pairs of `GITHUB_ID` and `GITHUB_SECRET`. In other words, you will need to register two different app for this single project in order to be functional in production and development. Remember the `Authorization callback URL` for dev will be `http://localhost:5173/api/auth/callback/github` while the production one will be `https://<your domain>/api/auth/callback/github`.

> [!IMPORTANT]
> Once you have two pairs of `GITHUB_ID` and `GITHUB_SECRET`, put the local one in local `.env.local` file and upload the another one to Vercel (or your hosting service environment variable).

## CREATE LOCAL ENV FILE

Before use, create the env file for customized routing.

Create `.env.local` file in the root directory.

```md
.
├── app
├── components
├── Notes
├── public
├── .env.local <--
...
```

Template for `.env.local`:

```env
# parameters for seraching
EXCLUDEDFILES_SEARCH = ["markdownCheatsheet.md","ignore search p.md"]
EXCLUDEDDIRECTORIES_SEARCH = ["ignore search post"]

# parameters for site listing
EXCLUDEDFILES = ["ignore routing d.md"]
EXCLUDEDDIRECTORIES = ["ignore routing dir"]

MDFOLDER = "Notes"

NEXTAUTH_URL=http://localhost:5173

# From last step
GITHUB_ID=xxxxxxxx
GITHUB_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx

# The email that allow to login with github. This can be single email string or an empty string that allows every one to login
ALLOWED_EMAIL=""

# The AUTH_SECRET can be automatically generated by `npx auth secret`
AUTH_SECRET="xxxxxxxxxxxxxxxxxxxxxxxx" # Added by `npx auth`. Read more: https://cli.authjs.dev

```

### Expected outcomes

-   `ignore search p.md` and files under `ignore search post` can not be searched.
-   `ignore routing d.md` and files under `ignore routing dir` will not be routed. This implies the content of those files can not be searched.

> [!IMPORTANT]
> When you update your `.env.local` file, remember update it in your vercel project.

## Build local server

> [!IMPORTANT]
> Remember create `.env.local` file!

```sh
git clone https://github.com/siraisisatoru/next-markdown-template.git
cd next-markdown-template
npm i --legacy-peer-deps
npm run dev
```

Access the demo via link [http://localhost:5173/Website%20page/Cheatsheet](http://localhost:5173/Website%20page/Cheatsheet)

## Deploy to Vercel hobby plan

> [!IMPORTANT]
> Remember create `.env.local` file!

1. Link your GitHub account to Vercel
2. Chose your repository to deploy
3. Configure build command and environment parameters
4. Build and deploy!

Once you create your project in Vercel, go to `Settings` -> `General` -> `Install Command` and choose `Override` by `npm i --legacy-peer-deps`.

You will also need to go to `Settings` -> `Environment Variables` -> `Import` under `Create new` -> find your `.env.local` file and `Open`. Note that `env` file can be hidden on your OS. You can see those file use `command+shift+,` on MacOS.

## Deploy to Google Firebase

> [!IMPORTANT]
> Remember create `.env.local` file!

~~Apparently, you can deploy NextJs project on Firebase while it needed in Blaze plan. The system is in the experiment stage and unstable to deploy (I was unable to deploy since two days ago)~~

~~More information can be found here: https://firebase.google.com/docs/hosting/frameworks/nextjs~~

~~Be aware your deployment may easily over the storage bandwidth per day in the free tier.~~

Had been experienced with Firebase for past couple monthes and the project become big enough and consuming a lot of resources that can easily excess the free tier. The personal project had been rencently transferred to Vercel.

# Contributing

Any new ideas want to add to the project are welcome. Please submit a pull request or open up an issue and we can discuss further.

# License

This project is licensed under the MIT License.
