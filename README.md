# EOL jQuery versions with security patches

In a perfect world, at least every MAJOR EOL jQuery release line would have a security-patched release. "Major" refers to the meaning of the term in [SemVer](https://semver.org/), thus releases that have breaking changes. The goal is to provide a patched version of jQuery for all major release lines to provide a path of least resistance for all downstream users to upgrade to a secure version jQuery with [no (or minimal) breaking changes](#but-what-about-breaking-changes).

| Status | jQuery version | jQuery-sec version | Branch       | PR              | Release | CVEs Patched                                                                                                                                    |
| ------ | -------------- | ------------------ | ------------ | --------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| ✅     | `2.2.4`        | `2.2.5-sec`        | [2.2.5-sec]  | [PR][2.2.5-pr]  |         | [CVE-2015-9251] \| [CVE-2019-11358] \| [CVE-2020-11022] \| [CVE-2020-11023] \| [CVE-2020-23064]                                                 |
| ✅     | `1.12.4`       | `1.12.5-sec`       | [1.12.5-sec] | [PR][1.12.5-pr] |         | [CVE-2015-9251] \| [CVE-2019-11358] \| [CVE-2020-11022] \| [CVE-2020-11023]                                                                     |
| ✅     | `1.8.3`        | `1.8.4-sec`        | [1.8.4-sec]  | [PR][1.8.4-pr]  |         | [CVE-2012-6708] \| [CVE-2015-9251] \| [CVE-2019-11358] \| [CVE-2020-7656] \| [CVE-2020-11022] \| [CVE-2020-11023]                               |
| ✅     | `1.7.2`        | `1.7.3-sec`        | [1.7.3-sec]  | [PR][1.7.3-pr]  |         | [CVE-2012-6708] \| [CVE-2015-9251] \| [CVE-2019-11358] \| [CVE-2020-7656] \| [CVE-2020-11022] \| [CVE-2020-11023]                               |
| ✅     | `1.6.4`        | `1.6.5-sec`        | [1.6.5-sec]  | [PR][1.6.5-pr]  |         | [CVE-2012-6708] \| [CVE-2015-9251] \| [CVE-2019-11358] \| [CVE-2020-7656] \| [CVE-2020-11022] \| [CVE-2020-11023]                               |
| ✅     | `1.5.2`        | `1.5.3-sec`        | [1.5.3-sec]  | [PR][1.5.3-pr]  |         | [CVE-2011-4969] \| [CVE-2012-6708] \| [CVE-2015-9251] \| [CVE-2019-11358] \| [CVE-2020-7656] \| [CVE-2020-11022] \| [CVE-2020-11023]            |
| ✅     | `1.4.4`        | `1.4.5-sec`        | [1.4.5-sec]  | [PR][1.4.5-pr]  |         | [CVE-2011-4969] \| [CVE-2012-6708] \| [CVE-2015-9251] \| [CVE-2019-11358] \| [CVE-2020-7656] \| [CVE-2020-11022] \| [CVE-2020-11023]            |
| ✅     | `1.3.2`        | `1.3.3-sec`        | [1.3.3-sec]  | [PR][1.3.3-pr]  |         | [CVE-2011-4969] \| [CVE-2012-6708] \| <del>CVE-2015-9251</del>\* \| [CVE-2019-11358] \| [CVE-2020-7656] \| [CVE-2020-11022] \| [CVE-2020-11023] |
| ✅     | `1.2.6`        | `1.2.7-sec`        | [1.2.7-sec]  | [PR][1.2.7-pr]  |         | [CVE-2011-4969] \| [CVE-2012-6708] \| <del>CVE-2015-9251</del>\* \| [CVE-2019-11358] \| [CVE-2020-7656] \| [CVE-2020-11022] \| [CVE-2020-11023] |

> [!IMPORTANT]
> \*CVE-2015-9251 is not reproducible in `1.2.6` and `1.3.2`

> [!IMPORTANT]
> CVE-2020-23064 is reproducible in all versions, but our understanding is that it is a duplicate of CVE-2020-11023

> [!NOTE]
> The 3.x release line is currently supported by jQuery, so we have no need to provide patched versions of 3.x at this time. jQuery 3.5 introduced a breaking change, but it was necessary to fix CVE-2020-11022 and CVE-2020-11023. However, since these vulnerabilities are present in virtually all versions of jQuery, there would be no value in providing a patched version of 3.4 as it would need to include that breaking change anyway.

## Background

For one reason or another, various security issues have not been fixed or backported in older official jQuery release lines.

The presence of unpatched jQuery in a project does not necessarily mean there is an exploitable vector in that project. When analyzing a vulnerability, the project may find an exploitable vector and patch that vulnerability in their code without upgrading jQuery. Or, they may find that no exploitable vector exists. In both cases, arguably, there is no immediate compelling need to upgrade jQuery. The risk, of course, is that a future change may introduce an exploitable vector, so it is best to upgrade anyway to eliminate this possibility.

While some projects may be able to upgrade to newer/supported jQuery versions, this is often non-trivial in other projects, particularly with large, long-lived projects due to breaking changes.

The jQuery project spawned a large ecosystem, with myriad plugins and libraries that also depend on jQuery. In many cases, those projects have been abandoned, so when a jQuery upgrade is required, it leaves downstream users no choice but to either effectively adopt the projects and take on the maintenance burden, or replace them altogether; both of those options can be prohibitively expensive.

## Rationale

If we can patch an old version of jQuery without too much trouble, it has the potential to save downstream users a lot of time and effort AND help secure the web. If we can do that, why not make this publicly available? Some projects and organizations are _already_ using their own private patched versions of jQuery to solve this problem.

### But what about breaking changes?

In some cases, it may be unavoidable that a security fix involves a breaking change. Nonetheless, the patched version should only need to include those breaking changes that are absolutely necessary to fix the security issue(s) and nothing more. While this still potentially requires code changes from downstream users, it may be _far_ less than the changes that would be required by a more significant upgrade.

## Acceptance criteria for patched releases

- All CVEs for the release MUST be patched
- Wherever possible, reuse the existing patch code from patched official jQuery releases
- All existing passing tests MUST pass
- Additional unit/integration test coverage as needed to account for the changes
- A/B end-to-end acceptance tests against the unpatched and patched versions for all CVEs

## Testing (and building) jQuery

> [!IMPORTANT]
> To run the jQuery tests or to build jQuery, you need to checkout the branch of the version you are interested in, e.g. `1.6.5-sec`, from the [jQuery Security Patches repo](https://github.com/ctcpip/jquery-security-patches).
> To run the A/B CVE tests, use this repo.

### jQuery tests

#### Prerequisites

- [Make](https://en.wikipedia.org/wiki/Make_(software))
- Node.js
  - Node v20, the current LTS version at the time of this writing is the version used, although you may be successful with other versions
- You'll need to install php 5.6 -- a newer version of php will probably work as well, but we used 5.6
  - For Macs, We recommend using [homebrew-php](https://github.com/shivammathur/homebrew-php)
- For jQuery versions up to and including 1.8.3 / 1.8.4-sec, you can get away with the built-in php dev server along with some symlinks. For later versions of jQuery, you'll need to have (or install) a proper server.
  - The path of least resistance is to use `nginx`:
  - `brew install nginx`

#### 1.2.6 / 1.2.7-sec

- Checkout the `1.2.6` or `1.2.7-sec` branch
- Run `make` from the root folder of the repo
- Open `/tests/index.html` in your browser

#### 1.3.2 / 1.3.3-sec

- Checkout the `1.3.2` or `1.3.3-sec` branch
- Run `make test` from the root folder of the repo
- Open `/tests/index.html` in your browser

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
  - `make jquery`
- Follow the instructions in [Running a web server](#running-a-web-server)
  - if using the php dev server, create a symlink to `/src` from the `/test` folder:
    - `cd test && ln -s ../src src`

#### 1.5.2 / 1.5.3-sec

- Checkout the `1.5.2` or `1.5.3-sec` branch
- From the root folder of the repo:
  - `git submodule update --recursive`
    - if you get errors updating submodules, you may need to search for `[submodule` and update git:// urls to https://
  - `make`
- Follow the instructions in [Running a web server](#running-a-web-server)
  - if using the php dev server, create a symlink to `/src` from the `/test` folder:
    - `cd test && ln -s ../src src`

#### 1.6.4 / 1.6.5-sec

- Checkout the `1.6.4` or `1.6.5-sec` branch
- From the root folder of the repo:
  - `git submodule update --recursive`
    - if you get errors updating submodules, you may need to search for `[submodule` and update git:// urls to https://
- Follow the instructions in [Running a web server](#running-a-web-server)

#### 1.7.2 / 1.7.3-sec

- Checkout the `1.7.2` or `1.7.3-sec` branch
- From the root folder of the repo:
  - `git submodule update --recursive`
    - if you get errors updating submodules, you may need to search for `[submodule` and update git:// urls to https://
- Follow the instructions in [Running a web server](#running-a-web-server)

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
- Follow the instructions in [Running a web server](#running-a-web-server)
  - if using the php dev server, create a symlink to `/dist` from the `/test` folder:
    - `cd test && ln -s ../dist dist`

#### 1.12.4 / 1.12.5-sec

- Checkout the `1.12.4` or `1.12.5-sec` branch
- From the root folder of the repo:
  - `npm i -g grunt-cli`
  - Add the following `overrides` object to `package.json`:
    -`"overrides": { "graceful-fs": "^4.2.11" }`
  - Run `grunt`
  - If you get an error about `os.tmpDir()` in `node_modules/npm/node_modules/osenv/osenv.js` then:
    - Modify that file to call `os.tmpdir()` instead of `os.tmpDir()`
  - `grunt` should work now
- Follow the instructions in [Running a web server](#running-a-web-server)

#### 2.2.4 / 2.2.5-sec

- Checkout the `2.2.4` or `2.2.5-sec` branch
- From the root folder of the repo:
  - `npm i -g grunt-cli`
  - Run `grunt`
- Follow the instructions in [Running a web server](#running-a-web-server)

#### Running a web server

it is preferable to use NGINX instead of the php dev server and it is required for version 1.12 and up

##### Using NGINX

- A pre-configured `nginx` configuration file (`nginx.conf`) is in the root of the repo
  - Modify the first two paths near the top of the file to suit your filesystem
- In a separate terminal window, run `nginx`, replacing the paths to suit your filesystem:
  - `/path/to/nginx/bin/nginx -c /path/to/nginx.conf -g daemon\ off\;`
- From the `test/` folder of the repo:
  - `brew services start php@5.6`
- Open `localhost/tests` in your browser
- When you are finished:
  - `CTRL+C` in the terminal where you are running `nginx`
  - `brew services stop php@5.6`

##### Using php dev server

- From the root folder of the repo:
  - `php -S localhost:8000 -t test`
- Open `localhost:8000/tests` in your browser

### A/B end-to-end acceptance tests

Tests run on every push in CI via [GitHub workflow](https://github.com/ctcpip/jquery-security/actions/workflows/security-test.yml)

You can run the A/B tests locally in CI mode or manually in the browser

#### How to run A/B end-to-end acceptance tests in CI mode

- Checkout the `main` branch
- Run `nom test` in `/security/test`
- Rejoice!

#### How to run A/B end-to-end acceptance tests manually

- Checkout the `main` branch
- Run `nom run serve` in `/security/test`
- Open `localhost:3333` in your browser of choice
- Select the jQuery version you are interested in
- All CVEs are reproduced automatically, but you can trigger them again by clicking their respective buttons
- Check the `Patched` checkbox to load the patched version of the jQuery version you selected
- An attempt is made to trigger all CVEs automatically, but you can attempt to trigger them again by clicking their respective buttons
- Rejoice!

## Goals

Ultimately, our hope is that these patched versions can be approved and accepted by the official jQuery project/maintainers and deployed as official jQuery releases.

[1.2.7-sec]: https://github.com/ctcpip/jquery-security-patches/tree/1.2.7-sec
[1.2.7-pr]: https://github.com/ctcpip/jquery-security-patches/pull/2
[1.3.3-sec]: https://github.com/ctcpip/jquery-security-patches/tree/1.3.3-sec
[1.3.3-pr]: https://github.com/ctcpip/jquery-security-patches/pull/3
[1.4.5-sec]: https://github.com/ctcpip/jquery-security-patches/tree/1.4.5-sec
[1.4.5-pr]: https://github.com/ctcpip/jquery-security-patches/pull/5
[1.5.3-sec]: https://github.com/ctcpip/jquery-security-patches/tree/1.5.3-sec
[1.5.3-pr]: https://github.com/ctcpip/jquery-security-patches/pull/6
[1.6.5-sec]: https://github.com/ctcpip/jquery-security-patches/tree/1.6.5-sec
[1.6.5-pr]: https://github.com/ctcpip/jquery-security-patches/pull/1
[1.7.3-sec]: https://github.com/ctcpip/jquery-security-patches/tree/1.7.3-sec
[1.7.3-pr]: https://github.com/ctcpip/jquery-security-patches/pull/7
[1.8.4-sec]: https://github.com/ctcpip/jquery-security-patches/tree/1.8.4-sec
[1.8.4-pr]: https://github.com/ctcpip/jquery-security-patches/pull/8
[1.12.5-sec]: https://github.com/ctcpip/jquery-security-patches/tree/1.12.5-sec
[1.12.5-pr]: https://github.com/ctcpip/jquery-security-patches/pull/9
[2.2.5-sec]: https://github.com/ctcpip/jquery-security-patches/tree/2.2.5-sec
[2.2.5-pr]: https://github.com/ctcpip/jquery-security-patches/pull/10
[CVE-2011-4969]: https://github.com/advisories/GHSA-579v-mp3v-rrw5
[CVE-2012-6708]: https://github.com/advisories/GHSA-2pqj-h3vj-pqgw
[CVE-2015-9251]: https://github.com/advisories/GHSA-rmxg-73gg-4p98
[CVE-2019-11358]: https://github.com/advisories/GHSA-6c3j-c64m-qhgq
[CVE-2020-7656]: https://github.com/advisories/GHSA-q4m3-2j7h-f7xw
[CVE-2020-11022]: https://github.com/advisories/GHSA-gxr4-xjj5-5px2
[CVE-2020-11023]: https://github.com/advisories/GHSA-jpcq-cgw6-v4j6
[CVE-2020-23064]: https://github.com/advisories/GHSA-257q-pv89-v3xv
