"""
This is the employee module supports all the REST actions 
"""
# importing flask
from flask import make_response, abort
from database import select_all,insert_employee,update_employee,delete_employee,select_emp

def read_all():
    # Create the list of employee  from our data
    employee  = select_all()
    return [{
            "empid" :person[0],
            "fname": person[1],
            "lname": person[2],
            "dob": person[3],
            "address_type":person[4],
            "address":person[5]
        } for person in employee ]

def read_one(empid):
    # Does the person exist in employee list?
    
    person = select_emp(empid)
    
    # not found
    if person != [] :
        abort(
            404, "Person with {empid} empid not found".format(empid=empid)
        )
    employee = {
            "empid" :person[0][0],
            "fname": person[0][1],
            "lname": person[0][2],
            "dob": person[0][3],
            "address_type":person[0][4],
            "address":person[0][5]
        }
    return employee


def create(person):
    empid = person.get("empid", 0)
    fname = person.get("fname", None)
    lname = person.get("lname", None)
    dob   = person.get("dob", None)
    address_type = person.get("address_type", None)
    address = person.get("address", None)

    # Does the person exist already?
    emp_flag = select_emp(empid)
    if emp_flag == []  and empid is not None:
        employee = {
            "empid" :empid,
	    "fname": fname,
            "lname": lname,
            "dob": dob,
            "address_type":address_type,
            "address":address
        }
        insert_employee([empid,fname,lname,dob], [address_type,address])
        return employee, 201

    # Otherwise, they exist, that's an error
    else:
        abort(
            406,
            "Peron with empid {empid} already exists".format(empid=empid),
        )


def update(empid, person):
    fname = person.get("fname", None)
    lname = person.get("lname", None)
    dob   = person.get("dob", None)
    address_type = person.get("address_type", None)
    address = person.get("address", None)
    # Does the person exist in employee list?
    emp_flag = select_emp(empid)
    if emp_flag != []  and empid is not None:
        employee = {
            "empid" :empid,
	    "fname": fname,
            "lname": lname,
            "dob": dob,
            "address_type":address_type,
            "address":address
        }
        update_employee([empid,fname,lname,dob], [address_type,address])
        return employee

    # otherwise, nope, that's an error
    else:
        abort(
            404, "Person with empid {empid} not found".format(empid=empid)
        )


def delete(empid):
    # Does the person to delete exist?
    emp_flag = select_emp(empid)
    if emp_flag != []  and empid is not None:
        delete_employee(empid)
        return make_response(
            "{empid} successfully deleted".format(empid=empid), 200
        )

    # Otherwise, nope, person to delete not found
    else:
        abort(
            404, "Person with empid {empid} not found".format(empid=empid)
        )
