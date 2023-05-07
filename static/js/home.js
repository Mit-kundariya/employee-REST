// Create the namespace instance
let ns = {};

// Create the model instance
ns.model = (function() {
    'use strict';

    let $event_pump = $('body');

    // Return the API
    return {
        'read': function() {
            let ajax_options = {
                type: 'GET',
                url: 'api/employee',
                accepts: 'application/json',
                dataType: 'json'
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_read_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        },
        create: function(empid,fname, lname,dob,address_type,address) {
            let ajax_options = {
                type: 'POST',
                url: 'api/employee',
                accepts: 'application/json',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    'empid':empid,
                	'fname': fname,
                    'lname': lname,
                    'dob':dob,
                    'address_type':address_type,
                    'address':address
                })
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_create_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        },
        update: function(empid,fname, lname,dob,address_type,address) {
            let ajax_options = {
                type: 'PUT',
                url: 'api/employee/' + empid,
                accepts: 'application/json',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    'empid':empid,
                	'fname': fname,
                    'lname': lname,
                    'dob':dob,
                    'address_type':address_type,
                    'address':address
                    })
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_update_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        },
        'delete': function(empid) {
            let ajax_options = {
                type: 'DELETE',
                url: 'api/employee/' + empid,
                accepts: 'application/json',
                contentType: 'plain/text'
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_delete_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        }
    };
}());

// Create the view instance
ns.view = (function() {
    'use strict';

    let $empid = $('#empid'),
        $fname = $('#fname'),
        $lname = $('#lname'),
        $dob = $('#dob'),
        $address_type = $('#address_type'),
        $address = $('#address');

    // return the API
    return {
        reset: function() {
        	$empid.val('').focus();
            $fname.val('');
            $lname.val('');
            $dob.val('');
            $address_type.val('');
            $address.val('');
        },
        update_editor: function(empid,fname, lname,dob,address_type,address) {
        	$empid.val(empid).focus();
            $fname.val(fname);
            $lname.val(lname);
            $dob.val(dob);
            $address_type.val(address_type);
            $address.val(address);
        },
        build_table: function(employee) {
            let rows = ''

            // clear the table
            $('.employee table > tbody').empty();

            // did we get a employee array?
            if (employee) {
                for (let i=0, l=employee.length; i < l; i++) {
                    rows += `<tr><td class="empid">${employee[i].empid}</td><td class="fname">${employee[i].fname}</td><td class="lname">${employee[i].lname}</td><td class="dob">${employee[i].dob}</td><td class="address_type">${employee[i].address_type}</td><td class="address">${employee[i].address}</td></tr>`;
                }
                $('table > tbody').append(rows);
            }
        },
        error: function(error_msg) {
            $('.error')
                .text(error_msg)
                .css('visibility', 'visible');
            setTimeout(function() {
                $('.error').css('visibility', 'hidden');
            }, 3000)
        }
    };
}());

// Create the controller
ns.controller = (function(m, v) {
    'use strict';

    let model = m,
        view = v,
        $event_pump = $('body'),
        $empid = $('#empid'),
        $fname = $('#fname'),
        $lname = $('#lname'),
        $dob = $('#dob'),
        $address_type = $('#address_type'),
        $address = $('#address');

    // Get the data from the model after the controller is done initializing
    setTimeout(function() {
        model.read();
    }, 100)

    // Validate input
    function validate(empid,fname, lname,dob,address_type,address) {
        return empid !== "" && fname !== "" && lname !== "" && dob !== "" && address_type !== "" && address !== "";
    }

    // Create our event handlers
    $('#create').click(function(e) {
        let empid = $empid.val(),
            fname = $fname.val(),
            lname = $lname.val(),
            dob = $dob.val(),
            address_type = $address_type.val(),
            address = $address.val();

        e.preventDefault();

        if (validate(empid,fname, lname,dob,address_type,address)) {
            model.create(empid,fname, lname,dob,address_type,address)
        } else {
            alert('Problem with first or last name input');
        }
    });

    $('#update').click(function(e) {
        let empid = $empid.val(),
        	fname = $fname.val(),
        	lname = $lname.val(),
        	dob = $dob.val(),
        	address_type = $address_type.val(),
        	address = $address.val();
        e.preventDefault();

        if (validate(empid,fname, lname,dob,address_type,address)) {
            model.update(empid,fname, lname,dob,address_type,address)
        } else {
            alert('Problem with first or last name input');
        }
        e.preventDefault();
    });

    $('#delete').click(function(e) {
        let empid = $empid.val();

        e.preventDefault();

        if (validate('placeholder', empid)) {
            model.delete(empid)
        } else {
            alert('Problem with first or last name input');
        }
        e.preventDefault();
    });

    $('#reset').click(function() {
        view.reset();
    })

    $('table > tbody').on('dblclick', 'tr', function(e) {
        let $target = $(e.target),
            empid,
            fname,
            lname,
            dob,
            address_type,
            address;
        
        empid = $target
        	.parent()
        	.find('td.empid')
        	.text();

        fname = $target
            .parent()
            .find('td.fname')
            .text();

        lname = $target
            .parent()
            .find('td.lname')
            .text();
        
        dob = $target
	        .parent()
	        .find('td.dob')
	        .text();
        
        address_type = $target
	        .parent()
	        .find('td.address_type')
	        .text();
        
        address = $target
	        .parent()
	        .find('td.address')
	        .text();

        view.update_editor(empid,fname, lname,dob,address_type,address);
    });

    // Handle the model events
    $event_pump.on('model_read_success', function(e, data) {
        view.build_table(data);
        view.reset();
    });

    $event_pump.on('model_create_success', function(e, data) {
        model.read();
    });

    $event_pump.on('model_update_success', function(e, data) {
        model.read();
    });

    $event_pump.on('model_delete_success', function(e, data) {
        model.read();
    });

    $event_pump.on('model_error', function(e, xhr, textStatus, errorThrown) {
        let error_msg = textStatus + ': ' + errorThrown + ' - ' + xhr.responseJSON.detail;
        view.error(error_msg);
        console.log(error_msg);
    })
}(ns.model, ns.view));


