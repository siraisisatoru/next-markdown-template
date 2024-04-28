# next-markdown-template

This is a customized implementation of markdown renderer utilizing remark plugins, rehype plugins and pyodide in nextjs framework. This repository is a replica of a peer repo [`react-markdown-template`](https://github.com/siraisisatoru/react-markdown-template) while transferring the framework and language from javascript to typescript casued dramatic performance improvement.

# Purpose of this template

I was planning to build my own wiki page that hosts privately. My goal was to have sort of Python code blocks and render the output under the code block. There are several approaches including but not limited to building a HEXO plugin to render the output or building a customized react app that I can have full control of the design.

To extend the idea of rendering markdown files in React which may be useful in some cases in general while no existing template is available for this, this project has been produced.

This project was built on Vite and Reactjs. The page was decorated with Tailwind CSS and Daisyui.

# Live Demo

🚧 A live demo hasn't been set up yet. Will be updated soon.

# Supported features

## System design

-   ✅ Dark theme, Light theme and follow OS theme switch
-   ✅ Device responsive design

## Routing

-   ✅ Create pages based on the posts within a customizable directory

## Rendering

... list out the renderers (update in progress)

## Advanced feature

-   ✅ Client side fuzzy search of markdown files

## Brief ideas

-   💭 Image processing using Sharp js
-   💭 Google log-in and features with log-in users (bookmarks, lock pages access)

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

The implementation of CPP worker (`src/utils/cpp_worker`) was adopted from [https://github.com/InfiniteXyy/playcode](https://github.com/InfiniteXyy/playcode).

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

## Configure search contents

(update in progress)

# Render results

(update in progress)

# Usage

## Build local server

```sh
git clone https://github.com/siraisisatoru/next-markdown-template.git
cd next-markdown-template
npm i --legacy-peer-deps
npm run dev
```

Access the demo via link [http://localhost:3000/Website%20page/Cheatsheet](http://localhost:3000/Website%20page/Cheatsheet)

## Deploy to Firebase

(update in progress)

# Contributing

Any new ideas want to add to the project are welcome. Please submit a pull request or open up an issue and we can discuss further.

# License

This project is licensed under the MIT License.
