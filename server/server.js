const express = require("express")
const app = express()
const port = 3002

const cors = require("cors")

const sqlite = require("sqlite3").verbose()
const db = new sqlite.Database("goal-calendar.db")

const hat = require("hat")

app.use(express.json())
app.use(cors())

function sessionMiddleware(req, res, next) {
    const sessToken = req.headers.authorization
    if (!sessToken) {
        return res.json({errcode: 40301, message: "Need session token"})
    }

    db.get("SELECT id,name,email FROM user WHERE session_token = ?", [sessToken], function (err, row) {
        if (err) {
            console.error(err)
            return res.json({errcode: 50000, message: "Something went wrong"})
        }
        if (!row) {
            return res.json({errcode: 40302, message: "Forbidden"})
        }
        req.sessionUser = row

        next()
    })
}

app.get("/", function(req, res) {
    return res.json("hello goal calendar!")
})

app.get("/session-user", sessionMiddleware, function(req, res) {
    res.json({ok: true, data: req.sessionUser}) 
})

app.post("/register", function(req, res) {
    db.get("SELECT * FROM user WHERE email = ?", [req.body.email], function(err, row) {
        if (err) {
            console.error(err)
            return res.json({errcode: 50000, message: "Something went wrong"})
        }
        if (row) 
            return res.json({errcode: 40001, message: "Email already exist"})
       
        // generate session token
        const sessToken = hat()

        db.run("INSERT INTO user(name,email,password,session_token) VALUES(?,?,?,?)", [
            req.body.name,
            req.body.email,
            req.body.password,
            sessToken
        ], function(err){
            if (err) {
                console.error(err)
                return res.json({errcode: 50000, message: "Something went wrong"})
            }

            res.json({ok: true, message: "Registered sucessfully", session_token: sessToken})
        })
    })
})

app.post("/login", function(req, res) {
    db.get("SELECT * FROM user WHERE email = ? AND password = ?", [req.body.email, req.body.password], function(err, row) {
        if (err) {
            console.error(err)
            return res.json({errcode: 50000, message: "Something went wrong"})
        }
        if (!row) {
            return res.json({errcode: 40002, message: "Email or password is invalid"})
        }
        return res.json({ok: true, message: "Login sucessfully", session_token: row.session_token})
    })
})


app.get("/calendar", sessionMiddleware, function(req, res) {
    db.all("SELECT * FROM calendar WHERE user_id = ?", [req.sessionUser.id], function(err, rows) {
        if (err) {
            console.error(err)
            return res.json({errcode: 50000, message: "Something went wrong"})
        }

        return res.json({ok: true, data: rows || []})
    })
})

app.get("/calendar/:calendarId", sessionMiddleware, function(req, res) {
    db.get("SELECT * FROM calendar WHERE user_id = ? AND id = ?", [req.sessionUser.id, req.params.calendarId], function(err, row) {
        if (err) {
            console.error(err)
            return res.json({errcode: 50000, message: "Something went wrong"})
        }

        return res.json({ok: true, data: row || null})
    })
})

app.post("/calendar", sessionMiddleware, function(req, res) {
    db.run("INSERT INTO calendar(user_id,name) VALUES(?,?)", [req.sessionUser.id, req.body.name], function(err) {
        if (err) {
            console.error(err)
            return res.json({errcode: 50000, message: "Something went wrong"})
        }

        return res.json({ok: true, message: "Calendar successfully added"})
    })
})

app.put("/calendar/:calendarId", sessionMiddleware, function(req, res) {
    db.get("SELECT * FROM calendar WHERE user_id = ? AND id = ?", [req.sessionUser.id, req.params.calendarId], function (err, row){
        if (err) {
            console.error(err)
            return res.json({errcode: 50000, message: "Something went wrong"})
        }
        if (!row) {
            return res.json({errcode: 40003, message: "Calendar not found"})
        }

        db.run("UPDATE calendar SET name = ? WHERE id = ?", [req.body.name, req.params.calendarId], function (err) {
            if (err) {
                console.error(err)
                return res.json({errcode: 50000, message: "Something went wrong"})
            }

            return res.json({ok: true, message: "Calendar updated successfully"})
        })
    })
})

app.delete("/calendar/:calendarId", sessionMiddleware, function(req, res) {
    db.get("SELECT * FROM calendar WHERE user_id = ? AND id = ?", [req.sessionUser.id, req.params.calendarId], function (err, row){
        if (err) {
            console.error(err)
            return res.json({errcode: 50000, message: "Something went wrong"})
        }
        if (!row) {
            return res.json({errcode: 40003, message: "Calendar not found"})
        }

        db.run("DELETE FROM calendar WHERE id = ?", [req.params.calendarId], function (err) {
            if (err) {
                console.error(err)
                return res.json({errcode: 50000, message: "Something went wrong"})
            }

            return res.json({ok: true, message: "Calendar deleted successfully"})
        })
    })
})

app.get("/calendar/:calendarId/goal-achieved/now", sessionMiddleware, function(req, res) {
    db.get("SELECT * FROM goal_achieved WHERE calendar_id = ? AND date = date('now')", [req.params.calendarId], function(err, row) {
        if (err) {
            console.error(err)
            return res.json({errcode: 50000, message: "Something went wrong"})
        }
        const achieved = !!row

        return res.json({ok: true, data: {achieved}})
    })
})

app.put("/calendar/:calendarId/goal-achieved/toggle-now", sessionMiddleware, function(req, res) {
    db.get("SELECT * FROM goal_achieved WHERE calendar_id = ? AND date = date('now')", [req.params.calendarId], function(err, row) {
        if (err) {
            console.error(err)
            return res.json({errcode: 50000, message: "Something went wrong"})
        }
        if (!row) {
            db.run("INSERT INTO goal_achieved(calendar_id,date) VALUES(?,date('now'))", [req.params.calendarId], function (err) {
                if (err) {
                    console.error(err)
                    return res.json({errcode: 50000, message: "Something went wrong"})
                }
                return res.json({ok: true, message: "Goal successfully achieved"})
            })

        } else {
            db.run("DELETE FROM goal_achieved WHERE calendar_id = ? AND date = date('now')", [req.params.calendarId], function (err) {
                if (err) {
                    console.error(err)
                    return res.json({errcode: 50000, message: "Something went wrong"})
                }
                return res.json({ok: true, message: "Goal successfully un-achieved"})
            })

        }
    })
})

app.get("/calendar/:calendarId/goal-achieved", sessionMiddleware, function(req, res) {
    if (req.query.date) {
        db.get("SELECT * FROM goal_achieved WHERE calendar_id = ? AND date = ?", [req.params.calendarId, req.query.date], function(err, row) {
            if (err) {
                console.error(err)
                return res.json({errcode: 50000, message: "Something went wrong"})
            }

            return res.json({ok: true, data: row || null})
        })
    }
    else if(req.query.month){
        db.all("SELECT * FROM goal_achieved WHERE calendar_id = ? AND strftime('%Y-%m', date) = ?", [req.params.calendarId, req.query.month], function(err, rows) {
            if (err) {
                console.error(err)
                return res.json({errcode: 50000, message: "Something went wrong"})
            }

            return res.json({ok: true, data: rows})
        })
    }else {
        return res.json({errcode:40004, message: "Please input a query string"})
    }

})

app.post("/goal-achieved", sessionMiddleware, function(req, res) {
    db.run("INSERT INTO goal_achieved(calendar_id,date) VALUES(?,?)", [req.body.calendarId, req.body.date], function(err) {
        if (err) {
            console.error(err)
            return res.json({errcode: 50000, message: "Something went wrong"})
        }

        return res.json({ok: true, message: "Goal successfully added"})
    })
})

app.delete("/goal-achieved/:goalId", sessionMiddleware, function(req, res) {
    db.run("DELETE FROM goal_achieved WHERE id = ?", [req.params.goalId], function(err) {
        if (err) {
            console.error(err)
            return res.json({errcode: 50000, message: "Something went wrong"})
        }

        return res.json({ok: true, message: "Goal successfully removed"})
    })
})

app.put("/goal-achieved/:goalId", sessionMiddleware, function(req, res) {
    db.run("UPDATE goal_achieved SET note = ? WHERE id = ?", [req.body.note, req.params.goalId], function(err) {
        if (err) {
            console.error(err)
            return res.json({errcode: 50000, message: "Something went wrong"})
        }

        return res.json({ok: true, message: "Goal successfully updated"})
    })
})

app.listen(port, function() {
    console.log(`server is listening to port ${port}`)    
})