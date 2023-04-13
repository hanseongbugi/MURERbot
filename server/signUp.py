import mariadb

conn = None
cur = None
sql = ""

conn = mariadb.connect(
        user="root",
        password="anfdjqht",
        host="192.168.0.3",
        port=3307,
        database="murerbot"
    )
cur = conn.cursor()

sql = "INSERT INTO user VALUES('ididid','0000','nicknamess')"
cur.execute(sql)

conn.commit()
conn.close()