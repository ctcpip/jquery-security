# Testing

> [!IMPORTANT]
> In order to keep the version PRs clean, you will need to use different branches depending on whether you want to run the jQuery tests or the A/B CVE tests. For the A/B CVE tests, you need to checkout the `main` branch. For the jQuery tests, you need to checkout the branch of the version you are interested in, e.g. `1.6.5-sec`.

## jQuery tests

### How to run jQuery tests

Includes instructions only for how to run the tests on MacOS. (PRs welcome for instructions for other platforms!)

#### 1.2.6 / 1.2.7-sec

- Run `make test` from the root folder of the repo
- Open `tests/index.html` in your browser

#### 1.6.4 / 1.6.5-sec

##### Prerequisites

- Install php 5.6
  - We recommend using [homebrew-php](https://github.com/shivammathur/homebrew-php)

##### Running the tests

- Checkout the branch of the version you are interested in, e.g. `1.6.5-sec`
- Run php server from the root folder of the repo: `php -S 127.0.0.1:8000`
- Open `127.0.0.1:8000/tests/index.html` in your browser

## A/B end-to-end acceptance tests

At the moment, A/B E2E test verification for CVE fixes is done manually. We should automate this (QUnit, testem). (PRs welcome!)

### How to run A/B end-to-end acceptance tests

- Checkout the `main` branch
- Use a local webserver to serve the static files in the folder for the version you care about in this repo, e.g. `security/1.6.5-sec`.
  - This is trivial using something like VS Code. Just open up one of the HTML files, such as `/security/1.6.5-sec/index-1.6.4.html` and using the command palette, select `Live Preview: Show Preview (External Browser)`
- Open the A HTML file (in this example that would be `index-1.6.4.html` and if you're using VS Code to serve the files, it will likely be served at `http://127.0.0.1:3000/security/1.6.5-sec/index-1.6.4.html`)
- Click on every button, verifying each vulnerability manifests in the log, e.g. with an 'alert!' or 'prototype has been polluted' message. Also verify no unexpected errors appear.
- Open the B HTML file (in this example that would be `index-1.6.5-sec.html` and if you're using VS Code to serve the files, it will likely be served at `http://127.0.0.1:3000/security/1.6.5-sec/index-1.6.5-sec.html`)
- Click on every button, verifying each vulnerability DOES NOT manifest in the log, e.g. only showing that the CVE reproduction methods were called, but failed to reproduce the issue. Also verify no unexpected errors appear
- Rejoice!
