import os from 'node:os';
import { execSync } from 'node:child_process';
import { setTimeout } from 'node:timers/promises';
import assert from 'node:assert';
import { JSDOM } from 'jsdom';
import { cveMap, getPatchedVersion, jQueryVersions } from '../site/cve-data.mjs'

let failedAssertions = 0;

console.log('\nrunning jQuery security tests...\n');

const platform = os.platform();
console.log(`platform detected: ${platform}`);

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
	try {
		test(v);
		test(v, true);
	} catch (e) {
		if(e instanceof assert.AssertionError) {
			console.error(e);
			failedAssertions += 1;
		}
		else {
			throw e;
		}
	}
}


function test(version, patched) {

	const effectiveVersion = patched ? getPatchedVersion(version) : version;

	console.log(`
--------------------------------------------------------------------------------
  validating jQuery v${effectiveVersion}
--------------------------------------------------------------------------------
`)

	let p;

	try {
		p = execSync(`${cmd}"${baseURL}?VERSION=${version}&PATCHED=${patched}"`);
	} catch (error) {
		console.error(e);
	}

	const dom = new JSDOM(p.toString());

	const d = dom.window.document;

	assert.strictEqual(d.querySelector('#loaded-jQuery').textContent, effectiveVersion, `loaded jQuery v${effectiveVersion}`);

	for (const cve of cveMap) {
		if(cve[1].versions.includes(version)) {
			const status = d.querySelector(`#CVE-${cve[0]} .cve__footer-status`).textContent;
			console.log(status);
		}
	}

}

console.log('\n...done\n');

if(failedAssertions) {
	process.exitCode = 1;
}
