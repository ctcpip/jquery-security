<!-- markdownlint-disable MD024 -->

# Testing (and building) jQuery

> [!IMPORTANT]
> In order to keep the version PRs clean, you will need to use different branches depending on whether you want to run the jQuery tests, build jQuery, or run the A/B CVE tests. For the A/B CVE tests, you need to checkout the `main` branch. For the jQuery tests or to build jQuery, you need to checkout the branch of the version you are interested in, e.g. `1.6.5-sec`.

## Prerequisites

- [Make](https://en.wikipedia.org/wiki/Make_(software))
- Node.js
  - Node v20, the current LTS version at the time of this writing is the version used, although you may be successful with other versions
- You'll need to install php 5.6 -- a newer version of php will probably work as well, but we used 5.6
  - For Macs, We recommend using [homebrew-php](https://github.com/shivammathur/homebrew-php)
- For versions up to and including 1.8.3 / 1.8.4-sec, we were able to get away with the built-in php dev server. For later versions, you'll need to have (or install) a proper server.
  - The path of least resistance is to use `nginx`:
  - `brew install nginx`

## Testing

### jQuery tests

#### 1.2.6 / 1.2.7-sec

- Checkout the `1.2.6` or `1.2.7-sec` branch
- Run `make` from the root folder of the repo
- Open `/tests/index.html` in your browser

#### 1.3.2 / 1.3.3-sec

<!-- - Checkout the `1.3.2` or `1.3.3-sec` branch
- Run `make test` from the root folder of the repo
- Open `/tests/index.html` in your browser -->

#### 1.4.4 / 1.4.5-sec

- Checkout the `1.4.4` or `1.4.5-sec` branch
- From the root folder of the repo:
  - `git clone git@github.com:jquery/sizzle.git --depth=1 src/sizzle`
  - `cd src/sizzle`
  - `git fetch --tags`
  - Get corresponding sizzle branch for this jQuery version/release:
    - `git checkout 1.4.4`
  - `cd ../..`
  - `git clone git@github.com:qunitjs/qunit.git --depth=1 test/qunit`
  - `cd test/qunit`
  - Get the closest QUnit commit to the jQuery version/release:
    - `git checkout 25e4489a5f280e8f0a22ca99ecb401338bb75308`
  - `cd ..`
  - Create symlink to src in test folder:
    - `ln -s ../src src`
  - `cd ..`
  - `make jquery`
  - Run php server:
    - `php -S 127.0.0.1:8000 -t test`
- Open `/tests/index.html` in your browser

#### 1.5.2 / 1.5.3-sec

- Checkout the `1.5.2` or `1.5.3-sec` branch
- From the root folder of the repo:
  - `git submodule update --recursive`
    - if you get errors updating submodules, you may need to search for `[submodule` and update git:// urls to https://
  - `cd test`
  - Create symlink to src in test folder:
    - `ln -s ../src src`
  - `cd ..`
  - `make`
  - Run php server:
    - `php -S 127.0.0.1:8000 -t test`
- Open `/tests/index.html` in your browser

#### 1.6.4 / 1.6.5-sec

- Checkout the `1.6.4` or `1.6.5-sec` branch
- From the root folder of the repo:
  - `git submodule update --recursive`
    - if you get errors updating submodules, you may need to search for `[submodule` and update git:// urls to https://
  - Run php server:
    - `php -S 127.0.0.1:8000 -t test`
- Open `127.0.0.1:8000/tests/index.html` in your browser

#### 1.7.2 / 1.7.3-sec

- Checkout the `1.7.2` or `1.7.3-sec` branch
- From the root folder of the repo:
  - `git submodule update --recursive`
    - if you get errors updating submodules, you may need to search for `[submodule` and update git:// urls to https://
  - Run php server:
    - `php -S 127.0.0.1:8000 -t test`
- Open `127.0.0.1:8000/tests/index.html` in your browser

#### 1.8.3 / 1.8.4-sec

- Checkout the `1.8.3` or `1.8.4-sec` branch
- From the root folder of the repo:
  - `git submodule update --recursive`
    - If you get errors updating submodules, you may need to search for `[submodule` and update git:// urls to https://
  - Globally install the requisite ancient version of grunt: `npm i grunt@0.3.9 -g`
  - `npm i`
  - Modify the `grunt.js` file
    - Remove `submodules` from the default grunt task
    - Remove `compare_size` from default grunt task
  - Run `grunt`
    - You should get errors about `path.existsSync()` in `node_modules/grunt/lib/util/findup.js` and in `node_modules/grunt/bin/grunt`
      - Modify both files to `require('fs')` and change `path.existsSync()` to `fs.existsSync()`
  - Run `grunt`
    - It should work now
  - `cd test`
  - Create symlink to dist in test folder:
    - `ln -s ../dist dist`
  - `cd ..`
  - Run php server:
    - `php -S 127.0.0.1:8000 -t test`
- Open `127.0.0.1:8000/tests/index.html` in your browser

#### 1.12.4 / 1.12.5-sec

- Checkout the `1.12.4` or `1.12.5-sec` branch
- From the root folder of the repo:
  - `npm i -g grunt-cli`
  - Add the following `overrides` object to `package.json`:
    -`"overrides": { "graceful-fs": "^4.2.11" }`
  - Run `grunt`
  - If you get an error  about `os.tmpDir()` in `node_modules/npm/node_modules/osenv/osenv.js` then:
    - Modify that file to call `os.tmpdir()` instead of `os.tmpDir()`
  - `grunt` should work now
  - A pre-configured `nginx` configuration file (`nginx.conf`) is in the root of the repo
    - Modify the first two paths near the top of the file to suit your filesystem
  - In a separate terminal window, run `nginx`, replacing the paths to suit your filesystem:
    - `/path/to/nginx/bin/nginx -c /path/to/jquery/repo/nginx.conf -g daemon\ off\;`
  - `cd test`
  - `brew services start php@5.6`
- Open `127.0.0.1/tests/index.html` in your browser
- When you are finished:
  - `CTRL+C` in the terminal where you are running `nginx`
  - `brew services stop php@5.6`

#### 2.2.4 / 2.2.5-sec

- Checkout the `2.2.4` or `2.2.5-sec` branch
- From the root folder of the repo:
  - `npm i -g grunt-cli`
  - Run `grunt`
  - A pre-configured `nginx` configuration file (`nginx.conf`) is in the root of the repo
    - Modify the first two paths near the top of the file to suit your filesystem
  - In a separate terminal window, run `nginx`, replacing the paths to suit your filesystem:
    - `/path/to/nginx/bin/nginx -c /path/to/jquery/repo/nginx.conf -g daemon\ off\;`
  - `cd test`
  - `brew services start php@5.6`
- Open `127.0.0.1/tests/index.html` in your browser
- When you are finished:
  - `CTRL+C` in the terminal where you are running `nginx`
  - `brew services stop php@5.6`

### A/B end-to-end acceptance tests

Tests run on every push in CI via [GitHub workflow](https://github.com/ctcpip/jquery-security-patches/actions/workflows/security-test.yml)

You can run the A/B tests locally in CI mode or manually in the browser

#### How to run A/B end-to-end acceptance tests in CI mode

- Checkout the `main` branch
- Run `nom test` in `/security/test`
- Rejoice!

#### How to run A/B end-to-end acceptance tests manually

- Checkout the `main` branch
- Run `nom run serve` in `/security/test`
- Open <http://localhost:3333> in your browser of choice
- Select the jQuery version you are interested in
- All CVEs are reproduced automatically, but you can trigger them again by clicking their respective buttons
- Check the `Patched` checkbox to load the patched version of the jQuery version you selected
- An attempt is made to trigger all CVEs automatically, but you can attempt to trigger them again by clicking their respective buttons
- Rejoice!

## Building

### 1.2.6 / 1.2.7-sec

- Checkout the `1.2.6` or `1.2.7-sec` branch
- Run `make jquery` from the root folder of the repo
  - This will output `./dist/jquery.js`

### 1.3.2 / 1.3.3-sec

- Checkout the `1.3.2` or `1.3.3-sec` branch
- Run `make jquery` from the root folder of the repo
  - This will output `./dist/jquery.js`

### 1.4.4 / 1.4.5-sec

- Checkout the `1.4.4` or `1.4.5-sec` branch
- From the root folder of the repo:
  - Run `make jquery`
    - This will output `./dist/jquery.js`

#### 1.5.2 / 1.5.3-sec

- Checkout the `1.5.2` or `1.5.3-sec` branch
- From the root folder of the repo:
  - Run `make`
    - This will output `./dist/jquery.js`

### 1.6.4 / 1.6.5-sec

- Checkout the `1.6.4` or `1.6.5-sec` branch
- From the root folder of the repo:
  - Run `make`
    - This will output `./dist/jquery.js`

#### 1.7.2 / 1.7.3-sec

- Checkout the `1.7.2` or `1.7.3-sec` branch
- From the root folder of the repo:
  - Run `make`
    - This will output `./dist/jquery.js`

#### 1.8.3 / 1.8.4-sec

- Checkout the `1.8.3` or `1.8.4-sec` branch
- From the root folder of the repo:
  - `git submodule update --recursive`
    - If you get errors updating submodules, you may need to search for `[submodule` and update git:// urls to https://
  - Globally install the requisite ancient version of grunt: `npm i grunt@0.3.9 -g`
  - `npm i`
  - Modify the `grunt.js` file
    - Remove `submodules` from the default grunt task
    - Remove `compare_size` from default grunt task
  - Run `grunt`
  - You should get errors about `path.existsSync()` in `node_modules/grunt/lib/util/findup.js` and in `node_modules/grunt/bin/grunt`
    - Modify both files to `require('fs')` and change `path.existsSync()` to `fs.existsSync()`
  - Run `grunt`
    - This will output `./dist/jquery.js`

#### 1.12.4 / 1.12.5-sec

- Checkout the `1.12.4` or `1.12.5-sec` branch
- From the root folder of the repo:
  - `npm i -g grunt-cli`
  - Add the following `overrides` object to `package.json`:
    -`"overrides": { "graceful-fs": "^4.2.11" }`
  - Run `grunt`
  - If you get an error  about `os.tmpDir()` in `node_modules/npm/node_modules/osenv/osenv.js` then:
    - Modify that file to call `os.tmpdir()` instead of `os.tmpDir()`
  - `grunt` should work now
    - This will output `./dist/jquery.js`

#### 2.2.4 / 2.2.5-sec

- Checkout the `2.2.4` or `2.2.5-sec` branch
- From the root folder of the repo:
  - `npm i -g grunt-cli`
  - Run `grunt`
    - This will output `./dist/jquery.js`
