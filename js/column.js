class Column {
  constructor(id = null) {
    const instance = this

    this.notes = []

    const element = this.element = document.createElement('div')
    element.classList.add('column')
    element.setAttribute('draggable', 'true')

    if (id) {
      element.setAttribute('data-column-id', id)
    } else {
      setTimeout(() => {
        Column.idCounter = Date.now()
      })
      element.setAttribute('data-column-id', JSON.stringify(Column.idCounter))
    }

    element.innerHTML =
      `
      <div class="header">
        <p class="column-header">В плане</p>
        <button class="remove-card">x</button>
      </div>  
      <div data-notes></div>
      <p class="column-footer">
        <span data-action-addNote class="action">+ Добавить карточку</span>
      </p>
      `
    element.querySelectorAll('.remove-card').forEach(el => {
      el.addEventListener('click', event => {
        Application.save(event)
      })
    })

    const spanAction_addNote = element.querySelector('[data-action-addNote]')

    spanAction_addNote.addEventListener('click', function (event) {
      const note = new Note
      instance.add(note)

      note.element.setAttribute('contenteditable', 'true')
      note.element.focus()
    })

    const headerElement = element.querySelector('.column-header')

    headerElement.setAttribute('data-title-id', JSON.stringify(Column.idCounter))
    headerElement.addEventListener('dblclick', (event) => {
      headerElement.setAttribute('contenteditable', 'true')
      headerElement.focus()
    })

    headerElement.addEventListener('blur', function (event) {
      headerElement.removeAttribute('contenteditable', true)
      Application.save(event)
    })

    element.addEventListener('dragstart', this.dragstart.bind(this))
    element.addEventListener('dragend', this.dragend.bind(this))

    element.addEventListener('dragover', this.dragover.bind(this))
    element.addEventListener('drop', this.drop.bind(this))
  }

  add(...notes) {
    for (const note of notes) {
      if (!this.notes.includes(note)) {
        this.notes.push(note)
        this.element.querySelector('[data-notes]').append(note.element)
      }
    }
  }

  dragstart(event) {
    Column.dragged = this.element
    Column.dragged.classList.add('dragged')

    event.stopPropagation()

    document
      .querySelectorAll('.note')
      .forEach(noteElement => noteElement.removeAttribute('draggable'))
  }

  dragend(event) {
    Column.dragged.classList.remove('dragged')
    Column.dragged = null
    Column.dropped = null

    document
      .querySelectorAll('.note')
      .forEach(noteElement => noteElement.setAttribute('draggable', true))

    document
      .querySelectorAll('.column')
      .forEach(columnElement => columnElement.classList.remove('under'))

    Application.save(event)
  }

  dragover(event) {
    event.preventDefault()
    event.stopPropagation()

    if (Column.dragged === this.element) {
      if (Column.dropped) {
        Column.dropped.classList.remove('under')
      }
      Column.dropped = null
    }

    if (!Column.dragged || Column.dragged === this.element) {
      return
    }

    Column.dropped = this.element

    document
      .querySelectorAll('.column')
      .forEach(columnElement => columnElement.classList.remove('under'))

    this.element.classList.add('under')
  }

  drop() {
    if (Note.dragged) {
      return this.element.querySelector('[data-notes]').append(Note.dragged)
    } else if (Column.dragged) {
      const children = Array.from(document.querySelector('.columns').children)
      const indexA = children.indexOf(this.element)
      const indexB = children.indexOf(Column.dragged)

      if (indexA < indexB) {
        document.querySelector('.columns').insertBefore(Column.dragged, this.element)
      } else {
        document.querySelector('.columns').insertBefore(Column.dragged, this.element.nextElementSibling)
      }

      document
        .querySelectorAll('.column')
        .forEach(columnElement => columnElement.classList.remove('under'))
    }
  }
}

Column.idCounter = Date.now()
Column.dragged = null
Column.dropped = null
