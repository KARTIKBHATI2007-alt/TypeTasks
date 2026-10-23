# TypeTasks Plus

A type-safe task tracker built with TypeScript, HTML and CSS.

**Live app:** https://kartikbhati2007-alt.github.io/TypeTasks/

## Features
- Add tasks with priority (low / medium / high) and an optional due date
- Advance tasks: todo → in-progress → done
- Filter by status, with live counts
- Overdue tasks are highlighted
- Tasks are saved in your browser (localStorage)

## Why TypeScript?
Every task follows a strict type, and its status can only be `todo`, `in-progress` or `done`. Invalid tasks can't compile, so bugs get caught before the app ever runs.

## Run locally
```sh
npm install
npm run build
npm run serve
```
Open the URL printed by `serve`. ES modules don't load from `file://`, so a local server is needed.
