import sqlite3

def initialize_database():
    try:
        conn = sqlite3.connect('EMPLOYEE.db')
        c = conn.cursor()
    
        # Create table
        c.execute('''CREATE TABLE IF NOT EXISTS EMPLOYEE_DETAILS
                     (employee_id INTEGER NOT NULL PRIMARY KEY, 
                      address_id INTEGER,
                      first_name text NOT NULL, 
                      last_name text NOT NULL, 
                      dob text NOT NULL
                     )''')
        
        c.execute('''CREATE TABLE IF NOT EXISTS ADDRESS_DETAILS
                     (address_id INTEGER NOT NULL, 
                      address_type text CHECK (address_type in ("permanent","present","office")), 
                      address text NOT NULL, 
                      PRIMARY KEY(address_id,address_type),
                      FOREIGN KEY (address_id) REFERENCES EMPLOYEE_DETAILS(address_id) )''')
        
        # Save (commit) the changes
        conn.commit()
    finally:
        # We can also close the connection if we are done with it.
        conn.close()
    
def select_all():
    try:
        conn = sqlite3.connect('EMPLOYEE.db')
        c = conn.cursor()
        emp_detail=c.execute('''SELECT employee_id, first_name, last_name, dob, address_type, address
                                FROM EMPLOYEE_DETAILS EMP 
                                INNER JOIN ADDRESS_DETAILS A 
                                ON EMP.address_id = A.address_id''')
        return list(emp_detail)
    
    finally:
        conn.close()
    

def select_emp(empid):
    try:
        conn = sqlite3.connect('EMPLOYEE.db')
        c = conn.cursor()
        emp_detail=c.execute('''SELECT employee_id, first_name, last_name, dob, address_type, address
                                FROM EMPLOYEE_DETAILS EMP 
                                INNER JOIN ADDRESS_DETAILS A 
                                ON EMP.address_id = A.address_id where employee_id = ?''',(empid,))
        return list(emp_detail)
    
    finally:
        conn.close()
    
def insert_employee(emp_details,address_details=None):
    try:
        conn = sqlite3.connect('EMPLOYEE.db')
        c = conn.cursor()
        if address_details == None:
            emp_details.insert(1,'NULL')
            c.execute("INSERT INTO EMPLOYEE_DETAILS VALUES (?,?,?,?,?)",emp_details)
        else:
            address_id = c.execute("SELECT max(address_id) FROM EMPLOYEE_DETAILS")
            address_id=list(address_id)[0][0]
            if address_id==None:
                address_id=0
            address_id+=1
            emp_details.insert(1,address_id)
            address_details.insert(0,address_id)
            c.execute("INSERT INTO EMPLOYEE_DETAILS VALUES (?,?,?,?,?)",emp_details)
            c.execute("INSERT INTO ADDRESS_DETAILS VALUES (?,?,?)",address_details)
        conn.commit()
    
    finally:
        conn.close()

def delete_employee(empid):
    try:
        conn = sqlite3.connect('EMPLOYEE.db')
        c = conn.cursor()
        address_id = c.execute("SELECT address_id FROM EMPLOYEE_DETAILS WHERE employee_id = ?",(empid,))
        address_id=list(address_id)[0][0]
        if not address_id==None:
            c.execute("DELETE FROM ADDRESS_DETAILS where address_id = ?",(address_id,))
        c.execute("DELETE FROM EMPLOYEE_DETAILS where employee_id = ?",(empid,))
        conn.commit()
        
    finally:
        conn.close()
        
def update_employee(emp_details,address_details=None):
    try:
        conn = sqlite3.connect('EMPLOYEE.db')
        c = conn.cursor()
        if address_details == None:
            pass
        else:
            address_id = c.execute("SELECT address_id FROM EMPLOYEE_DETAILS where employee_id = ?",(emp_details[0],))
            address_details.append(list(address_id)[0][0])
            c.execute("UPDATE ADDRESS_DETAILS set address_type = ?, address = ? WHERE address_id = ?",address_details)
        c.execute('''UPDATE EMPLOYEE_DETAILS SET first_name = ?, last_name = ?, dob = ? WHERE employee_id = ?''',emp_details[1:]+[emp_details[0]])
        conn.commit()
    
    finally:
        conn.close()
