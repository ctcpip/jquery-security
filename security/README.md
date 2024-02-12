# Testing

> [!IMPORTANT]
> In order to keep the version PRs clean, you will need to use different branches depending on whether you want to run the jQuery tests or the A/B CVE tests. For the A/B CVE tests, you need to checkout the `main` branch. For the jQuery tests, you need to checkout the branch of the version you are interested in, e.g. `1.6.5-sec`.

## jQuery tests

### How to run jQuery tests

Includes instructions only for how to run the tests on MacOS. (PRs welcome for instructions for other platforms!)

#### 1.2.6 / 1.2.7-sec

- Run `make test` from the root folder of the repo
- Open `/tests/index.html` in your browser

#### 1.6.4 / 1.6.5-sec

##### Prerequisites

- Install php 5.6
  - We recommend using [homebrew-php](https://github.com/shivammathur/homebrew-php)

##### Running the tests

- Checkout the branch of the version you are interested in, e.g. `1.6.5-sec`
- Run php server from the root folder of the repo: `php -S 127.0.0.1:8000`
- Open `127.0.0.1:8000/tests/index.html` in your browser

## A/B end-to-end acceptance tests

Tests run on every push in CI via [GitHub workflow](https://github.com/ctcpip/jquery-security-patches/actions/workflows/security-test.yml)

You can run the A/B tests locally in CI mode or manually in the browser

### How to run A/B end-to-end acceptance tests in CI mode

- Checkout the `main` branch
- Run `nom test` in `/security/test`
- Rejoice!

### How to run A/B end-to-end acceptance tests manually

- Checkout the `main` branch
- Run `nom run serve` in `/security/test`
- Open <http://localhost:3333> in your browser of choice
- Select the jQuery version you are interested in
- All CVEs are reproduced automatically, but you can trigger them again by clicking their respective buttons
- Check the `Patched` checkbox to load the patched version of the jQuery version you selected
- An attempt is made to trigger all CVEs automatically, but you can attempt to trigger them again by clicking their respective buttons
- Rejoice!
