const app = {
    init(selectors) {
        this.movies = []
        this.max = 0
        this.list = document
            .querySelector(selectors.listSelector)
        this.template = document
            .querySelector(selectors.templateSelector)
        document
            .querySelector(selectors.formSelector)
            .addEventListener('submit', this.addMovieViaForm.bind(this))

        this.load()
    },
    
    /*-----------------------------------------
    Method to load the movie from localStorage
    ------------------------------------------*/
    load() {
        // Get the JSON string out of localStorage
        const moviesJSON = localStorage.getItem('movies')

        // Turn that into an array
        const moviesArray = JSON.parse(moviesJSON)

        // Set this.movies to that array
        if (moviesArray) {
            moviesArray
                .reverse()
                .map(this.addMovie.bind(this))
        }
    },

    addMovie(movie) {
        const listItem = this.renderListItem(movie)
        this.list
            .insertBefore(listItem, this.list.firstChild)

        if(movie.id > this.max){
            this.max = movie.id
        }
        this.movies.unshift(movie)
        this.save()
    },

    addMovieViaForm(ev) {
        ev.preventDefault()
        const f = ev.target
        //console.log(f.movieName.value)
        const movie = {
            id: this.max + 1,
            name: f.movieName.value,
            year: f.year.value,
            promote: false,
        }

        this.addMovie(movie)
        f.reset()
    },

    save() {
        localStorage
            .setItem('movies', JSON.stringify(this.movies))

    },

    renderListItem(movie) {
        const item = this.template.cloneNode(true)
        item.classList.remove('template')
        item.dataset.id = movie.id
        
        if(movie.promote){
            item.classList.add('promote')
        }
        
        item
            .querySelector('.movie-name')
            .textContent = movie.name

        item
            .querySelector('.movie-year')
            .textContent = "Category: "+movie.year

        item
            .querySelector('button.remove')
            .addEventListener('click', this.removeMovie.bind(this))

        item
            .querySelector('button.edit')
            .addEventListener('click', this.editText.bind(this))

        item
            .querySelector('button.fav')
            .addEventListener('click', this.promoteMovie.bind(this, movie))

        item
            .querySelector('button.up')
            .addEventListener('click', this.moveUp.bind(this, movie))

        item
            .querySelector('button.down')
            .addEventListener('click', this.moveDown.bind(this, movie))

        return item
    },

    editText(ev){
        const editbutton = ev.target
        const listItem = ev.target.closest('.movie')
        const movieName = listItem.children[2]
        if(movieName.isContentEditable){
            //console.log("in true")
            movieName.contentEditable = false
            editbutton.classList.add('fa-pencil-square-o')
            editbutton.classList.remove('fa-check')
            editbutton.classList.add('warning')
            editbutton.classList.remove('success')

            // Find the movie in the array, and remove it
            for (let i = 0; i < this.movies.length; i++) {
                const currentId = this.movies[i].id.toString()
                if (listItem.dataset.id === currentId) {
                    this.movies[i].name = movieName.innerHTML
                    break
                }
            }
            //console.log(this.movies)
            this.save()
        }
        else{
            //console.log("false")
            movieName.contentEditable = true
            movieName.focus()
            editbutton.classList.add('fa-check')
            editbutton.classList.remove('fa-pencil-square-o')
            editbutton.classList.remove('warning')
            editbutton.classList.add('success')
        }
    },

    promoteMovie(movie, ev){
        const listItem = ev.target.closest('.movie')
        movie.promote = !movie.promote

        // toggle promote
        listItem.classList.toggle('promote')
        this.save()
    },

    removeMovie(ev) {
        const listItem = ev.target.closest('.movie')

        // Find the movie in the array, and remove it
        for (let i = 0; i < this.movies.length; i++) {
            const currentId = this.movies[i].id.toString()
            if (listItem.dataset.id === currentId) {
                this.movies.splice(i, 1)
                break
            }
        }

        listItem.remove()
        this.save()
    },

    moveUp(movie, ev) {
        const li = ev.target.closest('.movie')

        const index = this.movies.findIndex((currentMovie) => {
            return currentMovie.id === movie.id
        })
        //console.log(this.movies)
        //console.log(index)

        if (index > 0) {
            // Changing the DOM
            this.list.insertBefore(li, li.previousElementSibling)

            //Swap the movies in the array
            const previousMovie = this.movies[index - 1]
            this.movies[index - 1] = movie
            this.movies[index] = previousMovie

            this.save()
        }
    },

    moveDown(movie, ev) {
        const li = ev.target.closest('.movie')

        const index = this.movies.findIndex((currentMovie) => {
            return currentMovie.id === movie.id
        })
        
        if (index < this.movies.length - 1) {
            this.list.insertBefore(li.nextSibling, li)

            const nextMovie = this.movies[index + 1]
            this.movies[index + 1] = movie
            this.movies[index] = nextMovie

            this.save()
        }
    },
}

app.init({
    formSelector: '#movie-form',
    listSelector: '#movie-list',
    templateSelector: '.movie.template',
})


