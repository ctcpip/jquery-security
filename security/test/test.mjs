import os from 'node:os';
import { execSync } from 'node:child_process';
import { JSDOM } from 'jsdom';
import { cveMap, getPatchedVersion, jQueryVersions } from '../site/cve-data.mjs'
import t from 'tap'
import chalk from 'chalk';

function banner(txt) {
	console.log(chalk.magenta(`
--------------------------------------------------------------------------------
  ${chalk.cyan(txt)}
--------------------------------------------------------------------------------
`))
}

banner('running jQuery security tests...');

const platform = os.platform();
console.log(chalk.white(`  platform detected: ${platform}`));

const baseURL = 'http://127.0.0.1:3333/index.html';
const timeout = 5 * 1000;

let cmd;

if(platform === 'darwin'){
  cmd = `"/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome" `;
}
else {
	// presume *nix
	cmd = 'chrome ';
}

cmd += `--headless=old --virtual-time-budget=${timeout} --run-all-compositor-stages-before-draw --dump-dom `;

for (const v of jQueryVersions) {
	await t.test(v, async => testJQuery(v));
	await t.test(getPatchedVersion(v), async => testJQuery(v, true));
}

async function testJQuery(version, patched) {

	const effectiveVersion = patched ? getPatchedVersion(version) : version;

	banner(`validating jQuery v${effectiveVersion}`);

	const p = execSync(`${cmd}"${baseURL}?VERSION=${version}&PATCHED=${patched}"`);

	const dom = new JSDOM(p.toString());

	const d = dom.window.document;

	t.equal(d.querySelector('#loaded-jQuery').textContent, effectiveVersion, `loaded jQuery v${effectiveVersion}`);

	for (const cve of cveMap) {
		if(cve[1].versions.includes(version)) {
			const cveName = `CVE-${cve[0]}`
			const status = d.querySelector(`#${cveName} .cve__footer-status`).textContent;

			if(status.startsWith(`Can't`)) {
				console.log(chalk.green(`${cveName.padEnd(14)}  -  ${status}`));
			}
			else {
				console.log(chalk.red(status
					.replace('CVE', `${cveName.padEnd(14)}  - `)
				));
			}
		}
	}
}

banner('...done');
