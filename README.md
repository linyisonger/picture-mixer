### 图片混合组件

这是一个很'常用'的图片混合组件。🍾


![Git Actions](https://img.shields.io/github/workflow/status/LINYISONGER/picture-mixer/npm%20packages%20publish?style=for-the-badge)![Apache-2.0](https://img.shields.io/github/license/linyisonger/picture-mixer?style=for-the-badge)![Stars](https://img.shields.io/github/stars/linyisonger/picture-mixer?style=for-the-badge) ![npm](https://img.shields.io/npm/v/picture-mixer?style=for-the-badge)![npm](https://img.shields.io/npm/dw/picture-mixer?style=for-the-badge)

#### 支持平台

​    ![image](https://img2022.cnblogs.com/blog/1415778/202205/1415778-20220506100852595-613509558.svg) 

微信小程序

#### 效果

![image](https://img2022.cnblogs.com/blog/1415778/202205/1415778-20220510101636124-1571709519.gif)

#### 使用

新建小程序，如果存在跳过此步骤。

在项目目录下执行`npm init`生成`package.json`文件，如果存在`package.json`文件跳过此步骤。

执行`npm i picture-mixer`安装组件。 

点击`操作栏`上的`工具`-`构建npm`成功之后将会出现一个`miniprogram_npm`文件夹。

##### 引用组件

`index.json`

```json
{
    "usingComponents": {
        "p-mixer": "/miniprogram_npm/picture-mixer/index"
    }, 
    "disableScroll": true // 防止ios随意拖拽
}
```

##### 加载组件

`index.wxml`

```html
<p-mixer id="pm"></p-mixer>
<view class="op">
  <button type="primary" bindtap="add">添加</button>
  <button type="primary" bindtap="save">保存</button>
</view>
<image class="preview" src="{{preSrc}}" style="width: {{w}}px; height: {{h}}px;" mode="scaleToFill"></image>
```

##### 组件方法

`index.js`

```js
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
```

##### 组件样式

`index.wxss`

```css
page {
  display: flex;
  flex-direction: column;
}

#pm,
.preview {
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);
  margin: 20px auto;
}

.op {
  display: flex;
  justify-content: space-around;
}

button {
  display: inline-flex;
}
```

#### 属性

##### config

`config: IPictureMixerConfig` 配置 

``` typescript
/**
 * 图片混合器配置
 */
export interface IPictureMixerConfig {
  /** 渲染间隔 ms */
  renderInterval?: number
  /** 允许缩放 存在bug */
  allowScale?: boolean
  /** 允许移动 */
  allowMove?: boolean
  /** 允许删除 */
  allowRemove?: boolean
  /**
   *  允许自动设置置顶
   *  逻辑点击哪个图片哪个图片置顶
   */
  allowAutoSetTop?: boolean
  /** 背景颜色 */
  background?: string
  /** 点 */
  point?: {
    /** 颜色 点 */
    color?: string,
    /** 半径 */
    raduis?: number,
  },
  /** 线 */
  line?: {
    /** 颜色 线 */
    color?: string,
    /** 宽度 */
    width?: number
  },
  /** 缩放 */
  scale?: {
    /** 最小宽度 */
    minWidth?: number
    /** 最大高度 */
    minHeight?: number
  },
  /** 移动 */
  move?: {
    limitMode?: keyof IPictureMixerConfigMoveLimitMode
  }
  /** 添加 */
  add?: {
    /** 添加数量 */
    count?: number,
    /** 宽度比例 0~1 */
    scaleWidth?: number
    /** 高度比例 0~1 */
    scaleHeight?: number
  },
  /** 删除 */
  remove?: {
    /** 图片地址 */
    url?: string
    /** 轴心点 0~1 */
    pivotX?: number,
    pivotY?: number,
    /** 相对坐标 */
    offsetX?: number
    offsetY?: number
    width?: number
    height?: number
  }
}

interface IPictureMixerConfigMoveLimitMode {
  /** 默认 */
  none: string
  /** 限制图片 */
  picture: string
  /** 限制点 */
  point: string
}
```

#### 方法

##### add

`add(url: string)` 添加图片

##### save 🆕

`async save(p: IPictureMixerSaveParams): Promise<IPictureMixerSaveResult>` 保存图片

``` typescript
/**
 * 保存图片的参数
 */
export interface IPictureMixerSaveParams {
  /**
   * 图片格式，默认为 image/png
   */
  type?: keyof IPictureMixerSaveType
  /**
   * 在指定图片格式为 image/jpeg 或 image/webp的情况下，可以从 0 到 1 的区间内选择图片的质量。如果超出取值范围，将会使用默认值 0.92。其他参数会被忽略。
   */
  encoderOptions?: number
}

interface IPictureMixerSaveType {
  'image/png': string
  'image/jpeg': string
  'image/webp': string
}

export interface IPictureMixerSaveResult {
  /** BASE64字符串 */
  base64: string,
  /** 临时图片 */
  tempFilePath: string,
  /** 渲染的图片宽度 */
  width: number,
  /** 渲染的图片高度 */
  height: number
}
```

