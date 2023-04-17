import config
import mariadb

databaseInfo = config.DATABASE

def connectDB(): # db 연결
    return mariadb.connect(
    user=databaseInfo["user"],
    password=databaseInfo["password"],
    host=databaseInfo["host"],
    port=databaseInfo["port"],
    database=databaseInfo["database"]
    )