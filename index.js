const express = require("express");
const path = require("node:path")
const app = express();
const fs = require('node:fs')
const users = require("./MOCK_DATA.json")
const DeletedUsers = require("./delet.json")
const PORT = process.env.PORT || 3000; // 3000 is for development purpose and process.env.PORT is for deployment purpose.

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res, next) => {
    console.log(req.url)
    console.log(users)
    res.sendFile(path.join(__dirname, 'index.html'))
})
app.get("/users", (req, res) => {
    const html = `
    <ul>
        ${users.map(user => `<li>${user.first_name} ${user.last_name}</li>`).join('')}
    </ul>
    `
    res.send(html)
})
app.get('/api/users', (req, res) => {
    res.json(users)
})
app.route(
    "/api/users/:id"
).get((req, res) => {
    console.log('hello from get')
    const id = Number(req.params.id)
    // console.log(id);
    const user = users.filter(user => user.id == id)
    res.json(user)

}).delete((req, res) => {
    const id = Number(req.params.id)
    const newUsers = users.filter((user) => {

        if (user.id === id) {
            // console.log('haye')
            // console.log(user)
            fs.writeFile('./delet.json', JSON.stringify([...DeletedUsers, { ...user }]), (err) => {
                if (err)
                    console.log(err)
            })
            console.log([...DeletedUsers, { ...user }])
            return false
        }
        else {

            return true
        }
    }
    );
    fs.writeFile("./MOCK_DATA.json ", JSON.stringify(newUsers), (err) => {
        if (err) {
            console.log(err);
        }
    })
    res.send(newUsers)
}).patch((req, res) => {
    let { first_name, last_name, email, gender, job_title, id } = req.body
    const myId = Number(req.params.id)
    console.log(req.body)
    // console.log(first_name, last_name, email, gender, job_title, id)
    const user = users.find((user) => user.id === myId)
    // console.log(first_name, last_name, email, job_title)
    user.first_name = first_name;
    user.last_name = last_name;
    user.email = email;
    user.job_title = job_title
    user.id = myId;
    fs.writeFileSync('./MOCK_DATA.json ', JSON.stringifyz(users))
    res.send(user)
})


app.post('/api/users', (req, res) => {
    console.log('hello from post');
    // console.log(req.body);
    const newUsers = [...users, { ...req.body, id: users.length + 1 }]
    try {
        fs.writeFileSync("./MOCK_DATA.json", JSON.stringify(newUsers))

    }
    catch (err) {
        console.log(err)
    }
    res.send(newUsers)
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
