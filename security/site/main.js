function log(txt){
  console.log(txt);
}

const errors = document.getElementById('errors');

function error(txt){

	const p = document.createElement("p");
  p.append(txt);
	p.classList.add('error');
  errors.append(p);

  console.error(txt);

}

window.onerror = function(message, source, lineno, colno, _error) {
	error(message, true);
	error(_error.stack);
};

const windowAlert = window.alert;

window.alert = function(...args) {
  log(`alert called with args ${args}`);
  // windowAlert(...args);
};

const cveMap = new Map([
  ['2011-4969', { versions: ['1.2.6', '1.3.2', '1.4.4', '1.5.2'] }],
  ['2012-6708', { versions: ['1.2.6', '1.3.2', '1.4.4', '1.5.2', '1.6.4', '1.7.2', '1.8.3'] }],
	['2015-9251', { versions: ['1.2.6', '1.3.2', '1.4.4', '1.5.2', '1.6.4', '1.7.2', '1.8.3', '1.12.4', '2.2.4'] }],
	['2019-11358', { versions: ['1.2.6', '1.3.2', '1.4.4', '1.5.2', '1.6.4', '1.7.2', '1.8.3', '1.12.4', '2.2.4'] }],
	['2020-7656', { versions: ['1.2.6', '1.3.2', '1.4.4', '1.5.2', '1.6.4', '1.7.2', '1.8.3'] }],
	['2020-11022', { versions: ['1.2.6', '1.3.2', '1.4.4', '1.5.2', '1.6.4', '1.7.2', '1.8.3', '1.12.4', '2.2.4'] }],
	['2020-11023', { versions: ['1.2.6', '1.3.2', '1.4.4', '1.5.2', '1.6.4', '1.7.2', '1.8.3', '1.12.4', '2.2.4'] }],
	['2020-23064', { versions: ['2.2.4'] }],
]);

const cveTemplate = `
<div class="cve">
	<div class="cve__header">
	</div>
	<div class="cve__body">
		<button type="button"></button>
	</div>
	<div class="cve__footer">
		<span class="cve__footer-status"></span>
		<span class="cve__footer-note"></span>
	</div>
</div>
`

const selVersion = document.getElementById('version');
const chkPatched = document.getElementById('patched');
const cveContainer = document.getElementById('cve-container');
const cveButtons = [];

for (const cve of cveMap) {
	const cveID = `CVE-${cve[0]}`;
	const t = document.createElement('template');
  t.innerHTML = cveTemplate;
	t.content.querySelector('.cve__header').textContent = cveID;
	const b = t.content.querySelector('button');
	b.textContent = cveID;
	b.addEventListener('click', function (){
		log(`called ${cveID}`)
		window[cveID.replaceAll('-', '_')](cve);
		setTimeout(() => updateCVE(cve), 100);
	});
	cveButtons.push(b);
	cveContainer.append(t.content);
}

const jQueryVersions = new Set(Array.from(cveMap, ([name, value]) => (value.versions)).flat());

for (const v of jQueryVersions) {
	const o = document.createElement('option');
	o.textContent = v;
	selVersion.append(o);
}

const VERSION = 'VERSION';
const PATCHED = 'PATCHED';

const sessionVersion = sessionStorage.getItem(VERSION);
const sessionPatched = sessionStorage.getItem(PATCHED);

if(sessionVersion) {
	selVersion.value = sessionVersion;
	chkPatched.checked = sessionPatched === 'true';
}

changeVersion();

function changeVersion() {

	const version = selVersion.value;
	const patched = chkPatched.checked;

	sessionStorage.setItem(VERSION, version);
	sessionStorage.setItem(PATCHED, patched);

	const s = document.createElement('script');

	s.onload = function() {

		$(document).ajaxError(function(...args) {
			error(`AJAX ERROR! CAN'T TEST FOR CVE! IS SERVER DOWN?`);
			for (let i = 0; i < args.length; i++) {
				error(JSON.stringify(args[i]));
			}
		});

		document.getElementById('loaded-jQuery').textContent = jQuery.fn.jquery;

		// bring this line back after fixing errors
		cveButtons.forEach(b => b.click());
	};

	const versionParts = version.split('.');
	const loadVersion = patched ? `${versionParts[0]}.${versionParts[1]}.${Number(versionParts[2]) + 1}-sec` : version;

	s.onerror = function() {
		if(typeof jQuery !== 'undefined') {
			error(`failed to load jQuery ${loadVersion}. jQuery ${jQuery.fn.jquery} is still currently loaded`);
		}
		else {
			error(`failed to load jQuery ${loadVersion}.`);
		}
	};

  s.src = `vendor/jquery-${loadVersion}.js`;

	document.body.appendChild(s);

	for (const cve of cveMap) {
		cve[1].triggered = false;
		cve[1].triggerCount = 0;
	}

	document.querySelectorAll('.cve__footer-status').forEach(e => e.textContent= '');
	document.querySelectorAll('.cve__footer-note').forEach(e => e.textContent= '');
	errors.innerHTML = '';
}

selVersion.addEventListener("change", changeVersion);
chkPatched.addEventListener("change", changeVersion);

function triggerCVE(cveID){
  const cve = cveMap.get(cveID);
  cve.triggered = true;
}

function updateCVE(cve) {

	const cveID = `CVE-${cve[0]}`;

	const $relevantCVEFooter = $(`div.cve__header:contains(${cveID})`).siblings('.cve__footer');
	const $footerStatus = $('.cve__footer-status', $relevantCVEFooter);

	const { triggered } = cve[1];
	let { triggerCount } = cve[1];

	if(triggered){
		triggerCount = Number.isInteger(triggerCount) ? triggerCount += 1 : 1;
		$footerStatus.text(`CVE triggered ${triggerCount} time${triggerCount > 1 ? 's' : ''}`);
		cve[1].triggerCount = triggerCount;
	}
	else {
		$footerStatus.text(`Can't reproduce! 🎉`);
		const v = sessionStorage.getItem(VERSION); // use version from session/select because our CVE map doesn't have the patched versions
		if(!cve[1].versions.includes(v)) {
			const $footerNote = $('.cve__footer-note', $relevantCVEFooter);
			$footerNote.text(`(but v${v} is not vulnerable to this CVE)`);
		}
	}
}

function CVE_2011_4969(cve){

	location.hash = `<img src="x" onerror="triggerCVE('${cve[0]}');">`;

	try {
		// presumably, when this vulnerability was discovered, browsers did not return `location.hash` encoded.
		// so we can't reproduce the issue without decoding
		$(decodeURIComponent(location.hash));
	} catch (e) {
		handleJQuerySyntaxError(e);
	}


}

function handleJQuerySyntaxError(e){

	const JQUERY_SYNTAX_ERROR = 'Syntax error, unrecognized expression';

	const errorMessage = typeof e === 'string' ? e : e.message;

	// we expect newer (unaffected) jQuery to throw a syntax error, so ignore it
	if(!errorMessage.startsWith(JQUERY_SYNTAX_ERROR)) {
		error(e);
	}

}

function CVE_2012_6708(cve) {
	try {
		$(`element[attribute='<img src="x" onerror="triggerCVE('${cve[0]}');" />']`).html();
	} catch (e) {
		handleJQuerySyntaxError(e);
	}
}

function CVE_2015_9251(cve) {
  $.get("http://localhost:4000/jqueryxss", function( content ) {
    // since we are relying on an external resource for this test, guard against regression
		const expected = `triggerCVE('${cve[0]}');`;
    const expectedContentFound = content === expected;
    if(!expectedContentFound) {
      error(`unexpected content found: '${content}' -- expected: '${expected}'`);
      error('CVE-2015-9251 CANNOT BE VERIFIED!');
    }
  });
	// log('CVE-2015-9251 is not reproducible in 1.2.6, so ignore this test');
}

function CVE_2019_11358(cve) {

  $.extend(true, {}, JSON.parse('{"__proto__": {"yee": true}}'))

  if({}.yee) {
		triggerCVE(cve[0]);
    log(`{} prototype has been polluted: ${JSON.stringify({}.__proto__)}`);
  }

	// undo the prototype pollution to prevent side effects
	delete Object.getPrototypeOf({}).yee;

}

function CVE_2020_7656() {
  $("#yee").load("xss.html #yee");
}

function CVE_2020_11022(cve) {
  const x1 = `<style><style /><img src=x onerror=triggerCVE('${cve[0]}');>`;
  const x2 = `<img alt="<x" title="/><img src=x onerror=triggerCVE('${cve[0]}');>">`;
  const $yee = $("#yee");
  $yee.html(x1);
  $yee.html(x2);
}

function CVE_2020_11023(cve) {
  const x = `<option><style></option></select><img src=x onerror=triggerCVE('${cve[0]}');></style>`;
  $("#yee").html(x);
}

function CVE_2020_23064(cve) {
	// this is a duplicate of CVE-2020-11023
	CVE_2020_11023(cve);
}
