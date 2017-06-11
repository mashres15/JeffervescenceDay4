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
    
    /*-----------------------------------------
    Method to load the flick from localStorage
    ------------------------------------------*/
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
        //console.log(f.flickName.value)
        const flick = {
            id: this.max + 1,
            name: f.flickName.value,
            year: f.year.value,
            promote: false,
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
        
        if(flick.promote){
            item.classList.add('promote')
        }
        
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
            .querySelector('button.edit')
            .addEventListener('click', this.editText.bind(this))

        item
            .querySelector('button.fav')
            .addEventListener('click', this.promoteFlick.bind(this, flick))

        item
            .querySelector('button.up')
            .addEventListener('click', this.moveUp.bind(this, flick))

        item
            .querySelector('button.down')
            .addEventListener('click', this.moveDown.bind(this, flick))

        return item
    },

    editText(ev){
        const editbutton = ev.target
        const listItem = ev.target.closest('.flick')
        const flickName = listItem.firstElementChild
        if(flickName.isContentEditable){
            //console.log("in true")
            flickName.contentEditable = false
            editbutton.classList.add('fa-pencil-square-o')
            editbutton.classList.remove('fa-check')
            editbutton.classList.add('warning')
            editbutton.classList.remove('success')

            // Find the flick in the array, and remove it
            for (let i = 0; i < this.flicks.length; i++) {
                const currentId = this.flicks[i].id.toString()
                if (listItem.dataset.id === currentId) {
                    this.flicks[i].name = flickName.innerHTML
                    break
                }
            }
            //console.log(this.flicks)
            this.save()
        }
        else{
            //console.log("false")
            flickName.contentEditable = true
            flickName.focus()
            editbutton.classList.add('fa-check')
            editbutton.classList.remove('fa-pencil-square-o')
            editbutton.classList.remove('warning')
            editbutton.classList.add('success')
        }
    },

    promoteFlick(flick, ev){
        const listItem = ev.target.closest('.flick')
        flick.promote = !flick.promote

        // toggle promote
        listItem.classList.toggle('promote')
        this.save()
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

        const index = this.flicks.findIndex((currentFlick) => {
            return currentFlick.id === flick.id
        })
        console.log(this.flicks)
        console.log(index)

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

        const index = this.flicks.findIndex((currentFlick) => {
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