Page({
  data: {
    preSrc: "",
    w: 0,
    h: 0
  },
  add() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      maxDuration: 30,
      camera: 'back',
      success: (res) => {
        res.tempFiles.forEach(t => {
          try {
            this.selectComponent('#pm').add(t.tempFilePath)
          } catch (error) {
            console.log(error);
          }
        })
      }
    })
  },
  async save() {
    let res = await this.selectComponent('#pm').save()
    this.setData({ preSrc: res.tempFilePath, w: res.width, h: res.height })

  },
  loaded(e) {
    let background_context = e.detail.background_context;
    let width = e.detail.width;
    let height = e.detail.height;
    background_context.strokeStyle = "#666";
    background_context.lineWidth = 1;
    background_context.beginPath();
    background_context.moveTo(width / 2, 0)
    background_context.lineTo(width / 2, height);
    background_context.closePath();
    background_context.stroke()
    background_context.beginPath();
    background_context.moveTo(0, height / 2)
    background_context.lineTo(width, height / 2);
    background_context.closePath();
    background_context.stroke()
  },
  change(e) {
    console.log(e);
  }
})
