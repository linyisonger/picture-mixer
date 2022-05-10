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
    }
  })
  