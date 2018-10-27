const express = require('express')
const app = express()

app.listen(3001)

app.get('/checklists/:id', (req, resp) => {
    resp.json({
        id: req.params.id,
        name: "Scrum Checklist",
        items: [
            {
                id: 1,
                description: "The team delivers tested software to every sprint",
                section: "Values, principles and fundamentals",
                priority: 55
            },
            {
                id: 2,
                description: "The team delivers tested software to every sprint",
                section: "Values, principles and fundamentals",
                priority: 55
            }
        ]
    })
})