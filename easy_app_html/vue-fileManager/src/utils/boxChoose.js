export default class BoxChoose {
  constructor (el, callBack) {
    this.selctBox = document.querySelector(el)
    console.log(document.querySelector(el))
    // 容器元素
    this.selctContent = this.selctBox.parentNode
    this.mouseOn = false
    this.startX = 0
    this.startY = 0
    this.mouseStopId = null
    this.callBack = callBack
    this._initEvent()
  }
  mousedown (e) {
    this.clearEventBubble(e)
    var { callBack } = this
    if (e.buttons !== 1 || e.which !== 1) return
    this.mouseStopId = setTimeout(() => {
      this.mouseOn = true
      this.startX = e.clientX - this.selctContent.offsetLeft + this.selctContent.scrollLeft
      this.startY = e.clientY - this.selctContent.offsetTop + this.selctContent.scrollTop
      this.selctBox.style.left = this.startX + 'px'
      this.selctBox.style.top = this.startY + 'px'
    }, 0)
    document.addEventListener('mousemove', this.mousemove.bind(this), false)
    document.addEventListener('mouseup', this.mouseup.bind(this), false)
    return callBack({
      startX: this.selctBox.offsetLeft,
      startY: this.selctBox.offsetTop,
      width: this.selctBox.offsetWidth,
      height: this.selctBox.offsetHeight,
      move: false,
      type: 'down'
    })
  }

  mousemove (e) {
    if (!this.mouseOn) return
    var { callBack } = this
    this.clearEventBubble(e)
    this.selctBox.style.display = 'block'
    let _x = e.clientX - this.selctContent.offsetLeft + this.selctContent.scrollLeft
    let _y = e.clientY - this.selctContent.offsetTop + this.selctContent.scrollTop
    if (e.clientY <= this.selctContent.offsetTop && this.selctContent.scrollTop > 0) {
      this.selctContent.scrollTop = Math.abs(e.clientY - this.selctContent.offsetTop)
    }
    this.selctBox.style.left = Math.min(_x, this.startX) + 'px'
    this.selctBox.style.top = Math.min(_y, this.startY) + 'px'
    this.selctBox.style.width = Math.abs(_x - this.startX) + 'px'
    this.selctBox.style.height = Math.abs(_y - this.startY) + 'px'
    return callBack({
      startX: this.selctBox.offsetLeft,
      startY: this.selctBox.offsetTop,
      width: this.selctBox.offsetWidth,
      height: this.selctBox.offsetHeight,
      move: true,
      type: 'move'
    })
  }

  mouseup (e) {
    if (!this.mouseOn) return
    var { callBack } = this
    this.clearEventBubble(e)
    this.selctBox.style.display = 'none'
    this.mouseOn = false
    return callBack({
      startX: this.selctBox.offsetLeft,
      startY: this.selctBox.offsetTop,
      width: this.selctBox.offsetWidth,
      height: this.selctBox.offsetHeight,
      move: false,
      type: 'up'
    })
  }

  _initEvent () {
    this.selctContent.addEventListener('mousedown', this.mousedown.bind(this), false)
  }

  clearEventBubble (e) {
    if (e.stopPropagation) e.stopPropagation()
    else e.cancelBubble = true
    if (e.preventDefault) e.preventDefault()
    else e.returnValue = false
  }
}
