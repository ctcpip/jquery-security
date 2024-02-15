import os from 'node:os';
import { execSync } from 'node:child_process';
import { JSDOM } from 'jsdom';
import { cveMap, getPatchedVersion, jQueryVersions } from '../site/cve-data.mjs'
import t from 'tap'
import chalk from 'chalk';

// these are fully patched
const patchedVersions = [
	'1.2.7-sec',
	'1.3.3-sec',
	'1.6.5-sec',
];

function banner(txt, {borderColor = 'magenta', textColor = 'cyan'} = {borderColor: 'magenta',  textColor: 'cyan'}) {
	console.log(chalk[borderColor](`
--------------------------------------------------------------------------------
  ${chalk[textColor](txt)}
--------------------------------------------------------------------------------
`))
}

const platform = os.platform();
banner(`platform detected: ${platform}`, { borderColor:'white', textColor: 'white' });
banner('running jQuery security tests...');

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
	await t.test(`validate jQuery v${v}`, async t => testJQuery(v, false, t));
	await t.test(`validate jQuery v${getPatchedVersion(v)}`, async t => testJQuery(v, true, t));
}

async function testJQuery(version, patched, t) {

	const effectiveVersion = patched ? getPatchedVersion(version) : version;

	banner(`validating jQuery v${effectiveVersion}`);

	const p = execSync(`${cmd}"${baseURL}?VERSION=${version}&PATCHED=${patched}"`);

	const dom = new JSDOM(p.toString());

	const d = dom.window.document;

	t.equal(d.getElementById('errors').childNodes.length, 0, 'there are no errors');
	t.equal(d.querySelector('#loaded-jQuery').textContent, effectiveVersion, `loaded jQuery v${effectiveVersion}`);

	for (const cve of cveMap) {
		if(cve[1].versions.includes(version)) {
			const cveName = `CVE-${cve[0]}`
			const status = d.querySelector(`#${cveName} .cve__footer-status`).textContent;
			const reproducible = !status.startsWith(`Can't`);

			if(reproducible) {
				console.log(chalk.red(status
					.replace('CVE', `${cveName.padEnd(14)}  - `)
				));
			}
			else {
				console.log(chalk.green(`${cveName.padEnd(14)}  -  ${status}`));
			}

			if(patched && patchedVersions.includes(effectiveVersion)) {
				t.notOk(reproducible, `${cveName} should be patched in v${effectiveVersion}`);
			}
			else {
				if(cve[1].exceptions.includes(version)) {
					t.notOk(reproducible, `${cveName} is supposed be reproducible in v${effectiveVersion} according to the CVE but it can't be reproduced`);
				}
				else {
					t.ok(reproducible, `${cveName} should be reproducible in v${effectiveVersion}`);
				}
			}
		}
	}
}

banner(`...done`);

if(t.counts.fail) {
	banner('FAIL 💔', { borderColor: 'red', textColor: 'red'});
}
else {
	banner('PASS 💚', { borderColor: 'green', textColor: 'green'});
}
