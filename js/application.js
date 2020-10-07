const Application = {
  save(event) {
    const object = {
      columns: {
        idCounter: Column.idCounter,
        items: []
      },
      notes: {
        idCounter: Note.idCounter,
        items: []
      }
    }


    if (event && event.target.className === 'remove-card') {
      console.log('card remove')
      const column = JSON.parse(localStorage.getItem('trello'))
      object.columns.items = column.columns.items.filter(item => {
        return JSON.stringify(item.id) !== event.target.closest('.column').dataset.columnId
      })
      document.querySelectorAll('.column').forEach(column => {
        if (column.dataset.columnId === event.target.closest('.column').dataset.columnId) {
          column.style.display = 'none'
        }
      })
    } else {
      console.log('card add')
      document
        .querySelectorAll('.column')
        .forEach(columnElement => {
          const column = {
            id: parseInt(columnElement.getAttribute('data-column-id')),
            noteIds: [],
            titles: [],
          }
          columnElement
            .querySelectorAll('.column-header')
            .forEach(titleElement => {
              column.titles.push(titleElement.textContent)
            })
          columnElement
            .querySelectorAll('.note')
            .forEach(noteElement => {
              column.noteIds.push(parseInt(noteElement.getAttribute('data-note-id')))
            })
          if (columnElement.style.display !== 'none') {
            object.columns.items.push(column)
          }
        })
    }

    document
      .querySelectorAll('.note')
      .forEach(noteElement => {
        const note = {
          id: parseInt(noteElement.getAttribute('data-note-id')),
          content: noteElement.textContent
        }
        object.notes.items.push(note)
      })

    const json = JSON.stringify(object)
    localStorage.setItem('trello', json)
  },

  delete() {
    if (document.querySelector('.columns').innerHTML) {
      console.log('cards clear')
      localStorage.clear();
      document.querySelectorAll('.column').forEach(col => col.style.display = 'none')
    }
  },

  load() {
    if (!localStorage.getItem('trello')) {
      return
    }

    const mountePoint = document.querySelector('.columns')
    mountePoint.innerHTML = ''

    const object = JSON.parse(localStorage.getItem('trello'))
    const getNoteById = id => object.notes.items.find(note => note.id === id)

    for (const { id, noteIds, titles } of object.columns.items) {
      const column = new Column(id)

      mountePoint.append(column.element)

      for (let title of titles) {
        if (title.trim().length !== 0) {
          column.element.querySelector('.column-header').textContent = title
        } else {
          title = 'В плане'
          column.element.querySelector('.column-header').textContent = title
        }
      }

      for (const noteId of noteIds) {
        const { id, content } = getNoteById(noteId)
        const note = new Note(id, content)

        column.add(note)
      }
    }
  }
}
