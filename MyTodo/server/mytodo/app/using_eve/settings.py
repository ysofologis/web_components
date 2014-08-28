'''
Created on Jun 14, 2014

@author: freesrc
'''

MONGO_HOST = 'nosql-srv'
MONGO_PORT = 27017
#MONGO_USERNAME = 'freesrc'
#MONGO_PASSWORD = '123456789'
MONGO_DBNAME = 'bucket'


# Enable reads (GET), inserts (POST) and DELETE for resources/collections
# (if you omit this line, the API will default to ['GET'] and provide
# read-only access to the endpoint).
RESOURCE_METHODS = ['GET', 'POST', 'DELETE']

# Enable reads (GET), edits (PATCH), replacements (PUT) and deletes of
# individual items  (defaults to read-only item access).
ITEM_METHODS = ['GET', 'PATCH', 'PUT', 'DELETE']



person_schema = {
    # Schema definition, based on Cerberus grammar. Check the Cerberus project
    # (https://github.com/nicolaiarocci/cerberus) for details.
    'firstname': {
        'type': 'string',
        'minlength': 1,
        'maxlength': 10,
    },
    'lastname': {
        'type': 'string',
        'minlength': 1,
        'maxlength': 15,
        'required': True,
        # talk about hard constraints! For the purpose of the demo
        # 'lastname' is an API entry-point, so we need it to be unique.
        'unique': True,
    },
    # 'role' is a list, and can only contain values from 'allowed'.
    'role': {
        'type': 'list',
        'allowed': ["author", "contributor", "copy"],
    },
    # An embedded 'strongly-typed' dictionary.
    'location': {
        'type': 'dict',
        'schema': {
            'address': {'type': 'string'},
            'city': {'type': 'string'}
        },
    },
    'born': {
        'type': 'datetime',
    },
}

people = {
    # 'title' tag used in item links. Defaults to the resource title minus
    # the final, plural 's' (works fine in most cases but not for 'people')
    'item_title': 'person',

    # by default the standard item entry point is defined as
    # '/people/<ObjectId>'. We leave it untouched, and we also enable an
    # additional read-only entry point. This way consumers can also perform
    # GET requests at '/people/<lastname>'.
    'additional_lookup': {
        'url': 'regex("[\w]+")',
        'field': 'lastname'
    },

    # We choose to override global cache-control directives for this resource.
    'cache_control': 'max-age=10,must-revalidate',
    'cache_expires': 10,

    # most global settings can be overridden at resource level
    'resource_methods': ['GET', 'POST'],

    'schema': person_schema
}

task_status_schema = {
        'type': 'string',
        'required': True,
        'default' : "initialized",
        'allowed': ["initialized", "active", "completed", "suspended", "faulted", "deleted"],
}

task_assignee_schema = {
        'type': 'string',
        'minlength': 1,
        'maxlength': 100,
}


task_schema = {
    # Schema definition, based on Cerberus grammar. Check the Cerberus project
    # (https://github.com/nicolaiarocci/cerberus) for details.
    'title': {
        'type': 'string',
        'minlength': 1,
        'maxlength': 100,
        'required': True,
        'unique': True,
    },
    'description': {
        'type': 'string',
        'minlength': 1,
        'maxlength': 512,
    },
    # 'role' is a list, and can only contain values from 'allowed'.
    'status': task_status_schema,
    'priority': {
        'type': 'string',
        'required': True,
        'allowed': ["low", "normal", "high", "urgent"],
    },
    'type': {
        'type': 'string',
        'default' : "human-task",
        'allowed': ["notification", "human-task", "service-bridge"],
    },
    'assigned_to': task_assignee_schema,
    'input': {
        'type': 'dict',
    },
    'output': {
        'type': 'dict',
    },
    'status_history': {
        'type': 'list',
        'schema' : {
            'date': {'type': 'datetime'},
            'status': task_status_schema,
            'performed_by': task_assignee_schema
        }
    },
}


tasks = {
    # 'title' tag used in item links. Defaults to the resource title minus
    # the final, plural 's' (works fine in most cases but not for 'people')
    'item_title': 'task',
    
    #'public_methods': ['GET', 'PATCH', 'POST', 'DELETE'],
    # by default the standard item entry point is defined as
    # '/people/<ObjectId>'. We leave it untouched, and we also enable an
    # additional read-only entry point. This way consumers can also perform
    # GET requests at '/people/<lastname>'.
    'additional_lookup': {
        'url': 'regex("[\w]+")',
        'field': 'title'
    },

    # We choose to override global cache-control directives for this resource.
    'cache_control': 'max-age=10,must-revalidate',
    'cache_expires': 10,
    
    'item_methods' : ['GET','PATCH','DELETE', 'PUT'],

    'schema': task_schema
}

mitsos = {
    # 'title' tag used in item links. Defaults to the resource title minus
    # the final, plural 's' (works fine in most cases but not for 'people')
    'item_title': 'mitsakos',
    
    #'public_methods': ['GET', 'PATCH', 'POST', 'DELETE'],
    # by default the standard item entry point is defined as
    # '/people/<ObjectId>'. We leave it untouched, and we also enable an
    # additional read-only entry point. This way consumers can also perform
    # GET requests at '/people/<lastname>'.
    'additional_lookup': {
        'url': 'regex("[\w]+")',
        'field': 'title'
    },

    # We choose to override global cache-control directives for this resource.
    'cache_control': 'max-age=10,must-revalidate',
    'cache_expires': 10,
    
    'item_methods' : ['GET','PATCH','DELETE', 'PUT'],

    'schema': task_schema
}




DOMAIN = {
          'people': people,
          'tasks' : tasks,
	  'mitsos' : mitsos
}
