export default class Select extends EventTarget {
  private selectElement: Element = document.createElement('div')
  private optionElements: HTMLOptionElement[] = []
  private optionList: HTMLElement[] = []

  private selectTrigger: HTMLElement = document.createElement('div')

  constructor(selectContainer: string) {
    super()

    const element = document.querySelector(selectContainer)

    if (element) {
      this.selectElement = element
      this.optionElements = Array.from(
        this.selectElement.querySelectorAll('option'),
      )
    }

    this.init()
  }

  public get value(): string {
    return this.selectTrigger.dataset.value as string
  }

  public set value(v: string) {
    this.selectTrigger.innerHTML = v
    this.selectTrigger.setAttribute('data-value', v)
  }

  private init() {
    if (this.selectElement) {
      const selectWrapperElement = document.createElement('div')
      const selectElement = document.createElement('div')
      this.selectTrigger = document.createElement('div')
      const selectOptions = document.createElement('div')
      this.optionList = this.optionElements.map(e => {
        const option = document.createElement('div')

        option.setAttribute('class', 'select__option')
        option.setAttribute('data-value', e.value.trim())
        option.innerText = e.innerHTML.trim()

        if ('selected' in e.attributes) {
          option.classList.add('selected')
          this.selectTrigger.innerHTML = option.innerHTML.trim()
          this.selectTrigger.setAttribute(
            'data-value',
            option.dataset.value as string,
          )
        }

        option.addEventListener('click', this.handleClick.bind(this))

        return option
      })

      selectElement.setAttribute('class', 'select__wrapper')
      this.selectTrigger.setAttribute('class', 'select__trigger')
      selectOptions.setAttribute('class', 'select__options')

      selectOptions.append(...this.optionList)
      selectElement.appendChild(this.selectTrigger)
      selectElement.appendChild(selectOptions)

      selectWrapperElement.classList.add('select')
      this.selectElement.after(selectWrapperElement)
      selectWrapperElement.appendChild(this.selectElement)
      selectWrapperElement.appendChild(selectElement)

      this.selectTrigger.addEventListener('click', () => {
        this.selectTrigger.classList.toggle('open')
      })
    }
  }

  private handleClick(event: Event) {
    const target = event.target as HTMLElement

    this.selectTrigger.classList.toggle('open')
    this.selectTrigger.innerHTML = target.innerHTML
    this.optionList.forEach(e => e.classList.remove('selected'))

    target.classList.add('selected')

    this.dispatchEvent(new CustomEvent('change', { detail: target }))
  }

  public setSelect(value: string) {
    this.selectTrigger.innerHTML = value
    this.optionList.forEach((e: HTMLElement) => e.classList.remove('selected'))
    this.optionList.forEach((e: HTMLElement) => {
      if (e.dataset.value === value) {
        e.classList.add('selected')
      }
    })
  }

  handleCloseSelect(event: Event) {
    const target = event.target as HTMLElement

    if (
      !target.classList.contains('select__trigger') ||
      !(target === this.selectTrigger)
    ) {
      this.selectTrigger.classList.remove('open')
    }
  }
}
