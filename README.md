# daily-demos

Demo projects showcasing usage of [daily-js](https://github.com/daily-co/daily-js).

## Overview of available demo projects

An overview of the available demo projects can be found [in the Daily.co documentation](https://docs.daily.co/docs/demos).

## Running demo projects locally

Each demo project is an independent standalone project. You can choose to run a single project, or the entire demo project site.

### Running a single demo project

Using the `static-demos` project as an example:

```bash
# From daily-demos
nvm i
cd static-demos/
npm i
npm run start # or `npm run dev`, to automatically restart server on file changes
```

### Running the entire demo project site

```bash
# From daily-demos
nvm i
npm i
npm run start # or `npm run dev`, to automatically restart server on file changes
```

## Contributing a new demo project

To add a new demo project:

1. Create a new folder for the demo project directly under the root directory.

```bash
# From daily-demos
mkdir my-new-demo
```

2. Implement your project as a standalone site. Make sure it runs on a port not used by the other demo projects.

```bash
cd my-new-demo
npm init
# Etc, etc. Make a site.
```

3. When it's ready, hook your demo project up to the overall demo project site by: a) exposing your demo through the top-level index via proxying and b) making it run as part of the top-level `npm run dev` and `npm run start` scripts.

`index.js`:

```javascript
app.use(
  "/my-new-demo",
  createProxyMiddleware({
    target: "http://localhost:1234" // Your demo's port number
  })
);
```

`package.json`:

```json
"scripts": {
    "start": "concurrently npm:index-start npm:my-new-demo-start",
    "dev": "concurrently npm:index-dev npm:my-new-demo-dev",
    "my-new-demo-start": "cd my-new-demo && npm run start",
    "my-new-demo-dev": "cd my-new-demo && npm run dev"
  },
```
