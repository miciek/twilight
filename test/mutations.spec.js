import { expect } from 'chai'
import { mutations, getters } from '../src/store/index.js'

const { newGame, loadGame, moveCard, reshuffle, addPhase } = mutations

describe('twilight store', () => {
    it('creates new game with default cards', () => {
        const state = { }
        newGame(state, {name: "newgame"})

        expect(state.hasOwnProperty("cards")).to.equal(true)
        expect(state.hasOwnProperty("name")).to.equal(true)
        expect(getters.cardsInLocation(state)("deck").length).to.equal(35)
        expect(getters.cardsInLocation(state)("inactive").length).to.equal(67)
        // The China Card always starts with USSR
        expect(getters.cardsInLocation(state)("ussr").length).to.equal(1)
        expect(state.name).to.equal("newgame")
    })
    it('creates new game with optional cards (104-110)', () => {
        const state = { }
        newGame(state, { optional: true })
        expect(getters.cardsInLocation(state)("deck").length).to.equal(38)
        expect(getters.cardsInLocation(state)("ussr").length).to.equal(1)
    })
    it("loads game from saved data", () => {
        
    })
    it('moves cards between states', () => {
        const state = { }
        newGame(state)
        expect(state.hasOwnProperty("cards")).to.equal(true);

        moveCard(state, { card: state.cards[0], destination: "ussr" })
        expect(state.cards[0].location).to.equal("ussr")

        moveCard(state, { card: state.cards[1], destination: "usa" })
        expect(state.cards[1].location).to.equal("usa")

        moveCard(state, { card: state.cards[2], destination: "removed" })
        expect(state.cards[2].location).to.equal("removed")

        moveCard(state, { card: state.cards[3], destination: "discard" })
        expect(state.cards[3].location).to.equal("discard")
    })
    it('reshuffles discard into deck', () => {
        const state = { }
        newGame(state)

        moveCard(state, { card: state.cards[0], destination: "discard" })
        moveCard(state, { card: state.cards[1], destination: "usa" })
        moveCard(state, { card: state.cards[2], destination: "ussr" })
        moveCard(state, { card: state.cards[3], destination: "removed" })
        moveCard(state, { card: state.cards[4], destination: "discard" })

        reshuffle(state)
        expect(state.cards[0].location).to.equal("deck")
        expect(state.cards[1].location).to.equal("usa")
        expect(state.cards[2].location).to.equal("ussr")
        expect(state.cards[3].location).to.equal("removed")
        expect(state.cards[4].location).to.equal("deck")
    })
    it("adds mid war phase cards", () => {
        const state = { }
        newGame(state)
        expect(state.phase).to.equal("early")
        expect(getters.cardsInLocation(state)("deck").length).to.equal(35)

        addPhase(state, { phase: "mid" })
        expect(state.phase).to.equal("mid")
        expect(getters.cardsInLocation(state)("deck").length).to.equal(83)
    })
    it("gets cards with state", () => {
        const state = { }
        newGame(state)

        let cardsInLocation = getters.cardsInLocation(state)
        expect(cardsInLocation("deck").length).to.equal(35)

        moveCard(state, { card: state.cards[0], destination: "ussr" })
        expect(cardsInLocation("ussr").length).to.equal(2)
        expect(cardsInLocation("deck").length).to.equal(34)
        expect(cardsInLocation("usa").length).to.equal(0)
    })
    it("resets game correctly", () => {
        const state = { }
        newGame(state)

        moveCard(state, { card: state.cards[0], destination: "discard" })
        moveCard(state, { card: state.cards[1], destination: "usa" })
        moveCard(state, { card: state.cards[2], destination: "ussr" })
        moveCard(state, { card: state.cards[3], destination: "removed" })
        moveCard(state, { card: state.cards[4], destination: "discard" })

        newGame(state)
        expect(getters.cardsInLocation(state)("deck").length).to.equal(35)
        expect(getters.cardsInLocation(state)("ussr").length).to.equal(1)
    })
})