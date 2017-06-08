const app = {
    init(selectors) {
        this.flicks = []
        this.max = 0
        this.list = document
            .querySelector(selectors.listSelector)
        this.template = document
            .querySelector(selectors.templateSelector)
        document
            .querySelector(selectors.formSelector)
            .addEventListener('submit', this.addFlickViaForm.bind(this))

        this.load()
    },

    load() {
        // Get the JSON string out of localStorage
        const flicksJSON = localStorage.getItem('flicks')

        // Turn that into an array
        const flicksArray = JSON.parse(flicksJSON)

        // Set this.flicks to that array
        if (flicksArray) {
            flicksArray
                .reverse()
                .map(this.addFlick.bind(this))
        }
    },

    addFlick(flick) {
        const listItem = this.renderListItem(flick)
        this.list
            .insertBefore(listItem, this.list.firstChild)

        if(flick.id > this.max){
            this.max = flick.id
        }
        this.flicks.unshift(flick)
        this.save()
    },

    addFlickViaForm(ev) {
        ev.preventDefault()
        const f = ev.target
        const flick = {
            id: this.max + 1,
            name: f.flickName.value,
            year: f.year.value,
        }

        this.addFlick(flick)

        f.reset()
    },

    save() {
        localStorage
            .setItem('flicks', JSON.stringify(this.flicks))

    },

    renderListItem(flick) {
        const item = this.template.cloneNode(true)
        item.classList.remove('template')
        item.dataset.id = flick.id
        item
            .querySelector('.flick-name')
            .textContent = flick.name
        
        item
            .querySelector('.flick-year')
            .textContent = flick.year

        item
            .querySelector('button.remove')
            .addEventListener('click', this.removeFlick.bind(this))

        item
            .querySelector('button.fav')
            .addEventListener('click', this.promoteFlick.bind(this))
        
        item
            .querySelector('button.up')
            .addEventListener('click', this.moveUp.bind(this, flick))
        
        item
            .querySelector('button.down')
            .addEventListener('click', this.moveDown.bind(this, flick))

        return item
    },

    promoteFlick(ev){
        const listItem = ev.target.closest('.flick')

        // toggle promote
        listItem.classList.toggle('promote')
    },

    removeFlick(ev) {
        const listItem = ev.target.closest('.flick')

        // Find the flick in the array, and remove it
        for (let i = 0; i < this.flicks.length; i++) {
            const currentId = this.flicks[i].id.toString()
            if (listItem.dataset.id === currentId) {
                this.flicks.splice(i, 1)
                break
            }
        }

        listItem.remove()
        this.save()
    },

    moveUp(flick, ev) {
        const li = ev.target.closest('.flick')

        const index = this.flicks.findIndex((currentFlick, i) => {
            return currentFlick.id === flick.id
        })

        if (index > 0) {
            // Changing the DOM
            this.list.insertBefore(li, li.previousElementSibling)
            
            //Swap the flicks in the array
            const previousFlick = this.flicks[index - 1]
            this.flicks[index - 1] = flick
            this.flicks[index] = previousFlick

            this.save()
        }
    },

    moveDown(flick, ev) {
        const li = ev.target.closest('.flick')

        const index = this.flicks.findIndex((currentFlick, i) => {
            return currentFlick.id === flick.id
        })

        if (index < this.flicks.length - 1) {
            this.list.insertBefore(li.nextSibling, li)

            const nextFlick = this.flicks[index + 1]
            this.flicks[index + 1] = flick
            this.flicks[index] = nextFlick

            this.save()
        }
    },
}

app.init({
    formSelector: '#flick-form',
    listSelector: '#flick-list',
    templateSelector: '.flick.template',
})