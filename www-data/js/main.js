/**********
j-ini-minified
**********/
var INIRegex={section:/^\s*\[\s*([^\]]*)\s*\]\s*$/,trueParam:/^\s*([\w\.\-\_]+)\s*$/,param:/^\s*([\w\.\-\_]+)\s*=\s*(.*?)\s*$/,comment:/^\s*;.*$/};function populateValueWithToken(c,a,b){if(c.hasOwnProperty("section")){if(c.hasOwnProperty("trueParam")){c.value[c.section][c.trueParam][a]=b}else{c.value[c.section][a]=b}}else{if(c.hasOwnProperty("trueParam")){c.value[c.trueParam][a]=b}else{c.value[a]=b}}}function parseINIToken(c,b){if(INIRegex.trueParam.test(b)){var a=b.match(INIRegex.trueParam);if(c.hasOwnProperty("section")){c.value[c.section][a[1]]={}}else{c.value[a[1]]={}}c.trueParam=a[1]}else{if(INIRegex.param.test(b)){var a=b.match(INIRegex.param);populateValueWithToken(c,a[1],a[2])}}}function parseINILine(e,a){if(INIRegex.comment.test(a)){return}else{if(INIRegex.section.test(a)){var b=a.match(INIRegex.section);e.value[b[1]]={};e.section=b[1]}else{if(a.length==0&&e.hasOwnProperty("section")){delete e.section}else{var d=a.split(/\s+/);for(var c in d){parseINIToken(e,d[c])}delete e.trueParam}}}}function parseINI(c){var d={value:{}};var a=c.split(/\r\n|\r|\n/);for(var b in a){parseINILine(d,a[b])}return d.value}function updateINIChildren(e,a,c){for(var d in e.value[a][c]){if(e.value[c].hasOwnProperty(d)){continue}_default_child_attrib=e.value[a][c][d];for(var b in e.value[c]){e.value[c][b][d]=_default_child_attrib}}}function updateINIParents(c,a){for(var b in c.value){if(a==b){continue}if(typeof(c.value[b])=="string"){continue}if(Object.keys(c.value[b]).indexOf(a)<0){continue}updateINIChildren(c,b,a);c.value[b][a]=(c.value[a])}}function parseINIHiera(b){var c={value:parseINI(b)};for(var a in c.value){updateINIParents(c,a)}return c.value};

/**********
j-minified
**********/
function loadURI(a){var b=new XMLHttpRequest();b.open("GET",a,false);b.send();return b.responseText}
function $DOM(a,b){var c=document.querySelectorAll(a);if(b===undefined){b=0}return c[b]}

/**********
main()
**********/

