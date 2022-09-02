import express from 'express'
import cors from 'cors'
import { residentData, houseData } from './data'

let resident = residentData
let house = houseData

const app = express()
const port = 5000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send(`
    <h1>Click ⬇️ to get more info from data</h1>
    <ul>
    <li><a href='/house'>Click here to see houses</a></li>
    <li><a href='/resident'>Click here to see residents</a></li>
    </ul>
    `)
})


app.get('/resident', (req, res) => {

    let housesInResident = resident.map(resid => {
        let hous = house.filter(hous => hous.residentId === resid.id)
        return { ...resid, house: hous }
    })

    res.send(housesInResident)
})

app.post('/resident', (req, res) => {
    let errors: string[] = []

    if (typeof req.body.name !== 'string') {
        errors.push("Name not give or isn't a string")
    }

    if (typeof req.body.age !== 'number') {
        errors.push("Age not given or not a number")
    }

    if (typeof req.body.gender !== 'string') {
        errors.push("Gender not give or isn't a string")
    }

    if (errors.length === 0) {
        const newResident = {
            id: resident[resident.length - 1].id + 1,
            name: req.body.name,
            age: req.body.age,
            gender: req.body.gender,
        }
        resident.push(newResident)
        res.send(newResident)
    } else {
        res.status(404).send(errors)
    }
})

app.patch('/resident/:id', (req, res) => {
    let id = Number(req.params.id)
    let findMatch = resident.find(resid => resid.id === id)

    if (findMatch) {
        if (req.body.name) {
            findMatch.name = req.body.name
        }
        if (req.body.age) {
            findMatch.age = req.body.age
        }
        if (req.body.gender) {
            findMatch.gender = req.body.gender
        }
        res.send(findMatch)
    } else {
        res.send({ error: "Not able to PATCH because we don't have a resident with this ID" })
    }
})

app.delete('/resident/:id', (req, res) => {
    const id = Number(req.params.id)
    let residentToDelete = resident.findIndex(resid => resid.id === id)

    if (residentToDelete > -1) {
        resident.splice(residentToDelete, 1)
        res.send({ message: "Deleted successfully" })
    } else {
        res.send({ error: "We are facing issues deleting this resident from data.ts" })
    }
})


app.get('/house', (req, res) => {

    let residentInHouse = house.map(hous => {
        let resid = resident.find(resid => resid.id === hous.residentId)
        return { ...hous, resid }
    })

    res.send(residentInHouse)
})

app.post('/house', (req, res) => {
    let errors: string[] = []

    if (typeof req.body.address !== 'string') {
        errors.push("Address not give or isn't a string")
    }

    if (typeof req.body.type !== 'string') {
        errors.push("Type of house not give or isn't a string")
    }

    if (typeof req.body.residentId !== 'number') {
        errors.push("Resident Id is not give or isn't a number")
    }

    let resid = resident.find(resid => resid.id === req.body.residentId)
    if (!resid) {
        res.send({ errors: `We don't have a residnet with ID: ${req.body.residentId}` })
    }

    if (errors.length === 0) {
        const newHouse = {
            id: resident[resident.length - 1].id + 1,
            address: req.body.address,
            type: req.body.type,
            residentId: req.body.residentId
        }

        house.push(newHouse)
        res.send(newHouse)
    } else {
        res.status(404).send(errors)
    }
})

app.patch('/house/:id', (req, res) => {
    let id = Number(req.params.id)
    let findMatch = house.find(hous => hous.id === id)

    if (findMatch) {

        if (req.body.address) {
            findMatch.address = req.body.address
        }

        if (req.body.type) {
            findMatch.type = req.body.type
        }

        if (req.body.residentId) {
            findMatch.residentId = req.body.residentId
        }

        res.send(findMatch)
    } else {
        res.send({ error: "Not able to PATCH because we don't have a house with this ID" })
    }
})

app.delete('/house/:id', (req, res) => {

    const id = Number(req.params.id)
    let houseToDelete = house.findIndex(hous => hous.id === id)

    if (houseToDelete > -1) {
        house.splice(houseToDelete, 1)
        res.send({ message: "Deleted" })
    } else {
        res.send({ error: "We are facing an issue deleting this house" })
    }

})


app.listen(port, () => {
    console.log(`App is working on http://localhost:${port}`)
})