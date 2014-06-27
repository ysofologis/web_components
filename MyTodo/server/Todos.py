import random
import couchdb
from couchdb.mapping import *
#from couchdb.client import *
from datetime import datetime as datetime

def get_srv(address = "http://nosql-srv/couchdb"):
	return couchdb.Server(address)

def get_db(srv,db_name = "todos"):
	return srv[db_name]
		
def show_docs(db):
	for doc in db: print doc

def create_task(title, description = None, priority = 'normal', status = 'active' ):
	new_task = {
		'doc_type' : { 'name' : 'task', 'version' : [1,0]  },
		'title' : title,
		'description' : description or title,
		'priority' : priority,
		'status' : status,
		'date_created' : datetime.now().isoformat(),
		'input' : {},
		'output' : {}
	}
	return new_task

def create_random_tasks(db, range_from, range_to):
	rnd = random.Random()
	random_priority = lambda : rnd.sample(['low','normal','high'],1)[0]
	random_status = lambda : rnd.sample(['active','suspended','faulted','completed','initialized'],1)[0]
	for i in range(range_from,range_to):
		t = create_task( 'Task %03d' % i, 'Description for Task %03d' % i, random_priority(), random_status())	
		db.save(t)

