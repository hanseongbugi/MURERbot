from flask import session

def changeSessionData(key,value):
    session[key] = value

def getSessionData(key):
    return session.get(key)