/**
 * 树形控件
 */

export class Tree {
  constructor (data) {
    this.subset = {}
    this.info = data || []
  }

  comprehensive (parentId) {
    this.allSubset()
    return this.controls(this.subset[parentId])
  }

  allSubset () {
    for (var i = 0; i < this.info.length; i++) {
      if (this.subset[this.info[i].parentId]) {
        this.subset[this.info[i].parentId].push(this.info[i])
      } else {
        this.subset[this.info[i].parentId] = []
        this.subset[this.info[i].parentId].push(this.info[i])
      }
    }
  }

  controls (data) {
    if (!data) return ''
    var tree = []
    for (var i = 0; i < data.length; i++) {
      data[i].children = this.controls(this.subset[data[i].id])
      tree.push(data[i])
    }
    return tree
  }
}
