# EOL jQuery versions with security patches

This repository contains unofficial end-of-life jQuery releases with vulnerabilities patched.

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

## Patched releases

In a perfect world, at least every MAJOR EOL jQuery release line would have a security-patched release. "Major" refers to the meaning of the term in [SemVer](https://semver.org/), thus releases that have breaking changes. The goal is to provide a patched version of jQuery for all major release lines to provide a path of least resistance for all downstream users to upgrade to a secure version jQuery with [no (or minimal) breaking changes](#but-what-about-breaking-changes).

| jQuery version | jQuery-sec version | Branch                    | PR             | Release |
| -------------- | ------------------ | ------------------------- | -------------- | ------- |
| `1.2.6`        | `1.2.7-sec`        |                           |                |         |
| `1.3.2`        | `1.3.3-sec`        |                           |                |         |
| `1.4.4`        | `1.4.5-sec`        |                           |                |         |
| `1.5.2`        | `1.5.3-sec`        |                           |                |         |
| `1.6.4`        | `1.6.5-sec`        | [1.6.5-sec][1.6.5-branch] | [PR][1.6.5-pr] | TODO    |
| `1.7.2`        | `1.7.3-sec`        |                           |                |         |
| `1.8.3`        | `1.8.4-sec`        |                           |                |         |
| `1.12.4`       | `1.12.5-sec`       |                           |                |         |
| `2.2.4`        | `2.2.5-sec`        |                           |                |         |

> [!NOTE]
> The 3.x release line is currently supported by jQuery, so we have no need to provide patched versions of 3.x at this time. jQuery 3.5 introduced a breaking change, but it was necessary to fix CVE-2020-11022 and CVE-2020-11023. However, since these vulnerabilities are present in virtually all versions of jQuery, there would be no value in providing a patched version of 3.4 as it would need to include that breaking change anyway.

## Contributing

See [security/README.md](./security/README.md)

## Goals

Ultimately, our hope is that these patched versions can be approved and accepted by the official jQuery project/maintainers and deployed as official jQuery releases.

[1.6.5-branch]: https://github.com/ctcpip/jquery-security-patches/tree/1.6.5-sec
[1.6.5-pr]: https://github.com/ctcpip/jquery-security-patches/pull/1
