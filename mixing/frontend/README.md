# Mercury Mixing Frontend

Scripts and styles for the Mercury Mixing website. The frontend is divided in
two main sections (corresponding to the generated bundles):

- `src/index.js`: The modern Preact (React) + Redux application that allows users
  to upload their files for mixing. Generates `mixing.js` and `mixing.css`.

- `src/classic/classic.js`: The classic, site-wide scripts and styles for
  regular site navigation. Generates `classic.js` and `classic.css`.

## Development Workflow

**0. Install all npm dependencies when running for the first time**:
`npm install`

**1. Start a live-reload development server:**

```sh
PORT=8080 npm run dev
```

> This is a full web server nicely suited to your project. Any time you make
> changes within the `src` directory, it will rebuild and even refresh your
> browser.

In the Django template, you only need to include two `<script>` tags pointing
to `http://localhost:8080/classic.js` and `mixing.js`. Of course, this only
works for development, where the Webpack server is running. The next section
explains production. Live reloading of both styles and scripts will still work.

**2. Generate a production build in `/mixing/static/build`:**

```sh
npm run build
```

The resulting files are now in a path the Django's `collectstatic` can
understand. The file names will be the same as before. You'll need to update
the templates to fetch the scripts as any other static file, not from
`localhost:8080`.
