// postcode.js © 2013 b@zi.is GPLv2 */
'use strict'

document.addEventListener('DOMContentLoaded', function() {
    var crafty = CraftyPostcodeCreate();
    crafty.set("access_token", "");
    crafty.set("elem_street1", "address1");
    crafty.set("elem_postcode", "postcode");
    crafty.set("elem_company", "");
    crafty.set("elem_street3", "");
    crafty.set("elem_street2", "");
    crafty.set("elem_town", "");
    crafty.set("elem_county", "");
    crafty.set("elem_udprn", "");
    crafty.set("result_elem_id", "address");
    crafty.set("single_res_autoselect" , 1);
    crafty.set("hide_result" , 1);
    crafty.set("delimiter" , '\n');
    
    document.getElementById('find').addEventListener("click", function() {crafty.doLookup();}, false);
}, false);
