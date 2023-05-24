from flask import session

# key = uid
def changeSessionData(key,value):
    session[key] = value

def getSessionData(key):
    return session.get(key)