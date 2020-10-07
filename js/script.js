Application.load()

document
  .querySelector('[data-action-addColumn]')
  .addEventListener('click', event => {
    const column = new Column
    document.querySelector('.columns').append(column.element)
    Application.save(event)
  })

document.querySelector('[data-action-removeColumns]')
  .addEventListener('click', () => {
    Application.delete()
})
