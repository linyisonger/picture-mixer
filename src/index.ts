import { Vector2 } from "ru-toolkit-mathematics"
import { base64ToTempFilePath, createImage, IRotatePictureRotateParams, IRotatePictureRotateRes, scaling, timestamp } from "./utils"

/**
 * 图像操作按钮
 */
export interface IPictureOperateButton {
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


/**
 * 图片混合器配置
 */
export interface IPictureMixerConfig {
  /** 用于改变图片清晰度 尽量不要太大 
   * @version 1.0.1 
   */
  definition?: number
  /** 渲染间隔 ms */
  renderInterval?: number
  /** 允许缩放 写的很烂 */
  allowScale?: boolean
  /** 允许移动 */
  allowMove?: boolean
  /** 允许删除 */
  allowRemove?: boolean
  /** 允许旋转
   * @version 1.0.4
   */
  allowRotate?: boolean
  /**
   *  允许自动设置置顶
   *  逻辑点击哪个图片哪个图片置顶
   */
  allowAutoSetTop?: boolean
  /**
   * 允许展示水印
   * 仅在无图的时候展示
   * @version 1.0.3
   */
  allowWatermark?: boolean
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
    /** 1.0.2 模式 */
    mode?: keyof IPictureMixerConfigScaleMode
    /** 1.0.2 最小缩放比例 */
    minRatio?: number
    /** 暂时还没用到 最小宽度 */
    minWidth?: number
    /** 暂时还没用到 最大高度 */
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
  remove?: IPictureOperateButton,
  /** 保存默认值
   * @version 1.0.3
   */
  save?: {} & IPictureMixerSaveParams
  /** 水印图片
   * @version 1.0.2
   */
  watermark?: IPictureOperateButton
  /**
   * 旋转配置
   * @version 1.0.4
   */
  rotate?: IPictureOperateButton

}
/**
 * 保存的返回值
 */
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
/**
 * 加载完成回调参数
 */
export interface IPicturnMixerLoadedParams {
  detail: {
    background_context: CanvasRenderingContext2D,
    width: number,
    height: number
  }
}
/**
 * 内容变更回调参数
 */
export interface IPicturnMixerChangeParams {
  detail: {
    pictures: Picture[]
  }
}
interface IPictureMixerSaveType {
  'image/png': string
  'image/jpeg': string
  'image/webp': string
}
interface IPictureMixerConfigScaleMode {
  "width/height": string
  "ratio": string
}
interface IPictureMixerConfigMoveLimitMode {
  /** 默认 */
  none: string
  /** 限制图片 */
  picture: string
  /** 限制点 */
  point: string
}
enum PictureOpMode {
  /** 无 */
  none = 0,
  /** 移动 */
  move = 1,
  /** 缩放 */
  scale = 2,
  /** 旋转 */
  rotate = 4,
}
interface IPictureImg {
  width: number
  height: number
}
class Picture {
  url: string
  x: number
  y: number
  width: number
  height: number
  img: CanvasImageSource
  /** 初始值 */
  initialX: number
  initialY: number
  angle: number

  private _initialWidth: number
  private _initialHeight: number


  get initialWidth() {
    if (this.angle % 180 == 0)
      return this._initialWidth
    else
      return this._initialHeight;
  }
  get initialHeight() {
    if (this.angle % 180 == 0)
      return this._initialHeight
    else
      return this._initialWidth;

  }

  set initialWidth(val) {
    this._initialWidth = val;
  }
  set initialHeight(val) {
    this._initialHeight = val;
  }

  constructor(x?: number, y?: number, width?: number, height?: number) {
    this.initialX = this.x = x;
    this.initialY = this.y = y;
    this.initialWidth = this.width = width;
    this.initialHeight = this.height = height;
    this.angle = 0;
  }

  get leftTop() {
    return Vector2.c(this.x, this.y)
  }
  get rightTop() {
    return Vector2.c(this.x + this.width, this.y)
  }
  get rightBottom() {
    return Vector2.c(this.x + this.width, this.y + this.height)
  }
  get leftBottom() {
    return Vector2.c(this.x, this.y + this.height)
  }
  /**
   * 获取四个点坐标
   */
  get points(): Vector2[] {
    return [this.leftTop, this.rightTop, this.rightBottom, this.leftBottom]
  }
}




/** 默认值 */
const defaultConfig: IPictureMixerConfig = {
  definition: 1,
  renderInterval: 20,
  allowScale: true,
  allowMove: true,
  allowRemove: false,
  allowAutoSetTop: true,
  allowWatermark: true,
  allowRotate: true,
  background: "#fff",
  point: {
    color: "#B4CF66",
    raduis: 10,
  },
  line: {
    color: "#B4CF66",
    width: 2
  },
  scale: {
    mode: "ratio",
    minRatio: .5,
    minWidth: 40,
    minHeight: 40
  },
  move: {
    limitMode: 'point'
  },
  add: {
    count: 5,
    scaleWidth: .6,
    scaleHeight: .4,
  },
  remove: {
    url: 'data:image/png;base64,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',
    pivotX: 1,
    pivotY: 0,
    offsetX: 0,
    offsetY: 0,
    width: 30,
    height: 30,
  },
  save: {
    type: "image/jpeg",
    encoderOptions: 1
  },
  watermark: {
    url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAVCAYAAAAjODzXAAABnElEQVRIibVWMW7DMAy8Bt6yJ3vn6hWe2z2d8wDOeUBnPsBzsrdr/QpnTud0z14wpQJalWS5sQ8QDFOUdBKPlB6QARF9ADgw8z7nlwIRvQFwADpm3oVu2g/pq/6zQGbhLYBHY1rKRgCcI33w/9I3KRGd2Jn/zp+mOZ3ouKmJIBWGWJ8NzWLsKqIbInq9h2kMo4j4HcyBSheI7bALSIjPWu3nQuI1fo++HfL1GtlkfFZE5NSnJJWX6i94UUJfRUSY+dkatX541NpK64lkThjCbRGRAsjRfhb6ngA0ge0yROYPERVkp22jX6dtMNayKDN3oZGIsoNiWSMLHs1kRxVnbWI/OYrSV4uQy1TGu9EjoiJN6UHIbOYoZrAaMdpomfk7dJRQEdFBQ/Sk5jZVI4JL7hTYPeRSfIc/EVOs2pjQDJm96sWpfwxrnS8XRmeeB9eNLEyxSu4uIOMvrZT/SueT7Nlpa8z4RtP5Yu2VFp9Rj5+wAEZIlm7mhkpF2Ls7/MuslNgUqBKauIrSFLbZEa0jRpRZ8Y6EZM4te3oA8AOcoLs3H/j3KAAAAABJRU5ErkJggg==",
    pivotX: .5,
    pivotY: .5,
    offsetX: 0,
    offsetY: 0,
    width: 60,
    height: 30,
  },
  rotate: {
    url: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjU0NTIzNDM4MjE1IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjQ2MDMiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj5AZm9udC1mYWNlIHsgZm9udC1mYW1pbHk6IGZlZWRiYWNrLWljb25mb250OyBzcmM6IHVybCgiLy9hdC5hbGljZG4uY29tL3QvZm9udF8xMDMxMTU4X3U2OXc4eWh4ZHUud29mZjI/dD0xNjMwMDMzNzU5OTQ0IikgZm9ybWF0KCJ3b2ZmMiIpLCB1cmwoIi8vYXQuYWxpY2RuLmNvbS90L2ZvbnRfMTAzMTE1OF91Njl3OHloeGR1LndvZmY/dD0xNjMwMDMzNzU5OTQ0IikgZm9ybWF0KCJ3b2ZmIiksIHVybCgiLy9hdC5hbGljZG4uY29tL3QvZm9udF8xMDMxMTU4X3U2OXc4eWh4ZHUudHRmP3Q9MTYzMDAzMzc1OTk0NCIpIGZvcm1hdCgidHJ1ZXR5cGUiKTsgfQo8L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNMzQzLjgyOTMzMyAyMTIuNzM2YzE3My40NjEzMzMtMTAwLjEzODY2NyAzOTUuMjY0LTQwLjcwNCA0OTUuNDI0IDEzMi43NTczMzMgMTAwLjEzODY2NyAxNzMuNDQgNDAuNzA0IDM5NS4yNjQtMTMyLjc1NzMzMyA0OTUuNDAyNjY3LTcuNTMwNjY3IDQuMzUyLTE1LjE0NjY2NyA4LjQwNTMzMy0yMi44MjY2NjcgMTIuMTZMNjUxLjUyIDc5Ny40NGM3Ljc0NC0zLjYyNjY2NyAxNS40MDI2NjctNy42MzczMzMgMjIuOTU0NjY3LTExLjk4OTMzMyAxNDIuODQ4LTgyLjQ3NDY2NyAxOTEuNzg2NjY3LTI2NS4xMzA2NjcgMTA5LjMzMzMzMy00MDcuOTc4NjY3LTgyLjQ3NDY2Ny0xNDIuODQ4LTI2NS4xNTItMTkxLjc4NjY2Ny00MDgtMTA5LjMzMzMzMy0xNDIuODQ4IDgyLjQ3NDY2Ny0xOTEuNzg2NjY3IDI2NS4xNTItMTA5LjMxMiA0MDhhMjk3LjI4IDI5Ny4yOCAwIDAgMCAxMjcuODcyIDExOS4yMTA2NjZsLTMzLjUzNi05MC40OTYgNjAuMDEwNjY3LTIyLjI1MDY2NiA1MS4yIDEzOC4wOTA2NjYgMC42NCAwLjEyOC0wLjUxMiAwLjI3NzMzNCAxOC4wNDggNDguNjQtMTkwLjY3NzMzNCA0NC41ODY2NjYtMTQuNTcwNjY2LTYyLjMzNiA1NS41MzA2NjYtMTIuOTcwNjY2YTM2MS4wMjQgMzYxLjAyNCAwIDAgMS0xMjkuNDI5MzMzLTEzMC44OEMxMTAuOTMzMzMzIDUzNC42OTg2NjcgMTcwLjM2OCAzMTIuODk2IDM0My44MjkzMzMgMjEyLjczNnogbTE2Ni4wMzczMzQgMTUwLjUwNjY2N2MzLjc3NiAwIDUuNjc0NjY3IDEuOTIgNS42NzQ2NjYgNS42NzQ2NjZ2MjQ4Ljc4OTMzNGMwIDMuNzk3MzMzLTEuODk4NjY3IDUuNjc0NjY3LTUuNjc0NjY2IDUuNjc0NjY2aC0xNzEuMTM2Yy0zLjc3NiAwLTUuNjc0NjY3LTEuODc3MzMzLTUuNjc0NjY3LTUuNjc0NjY2di00Mi4xMTJjMC0zLjc3NiAxLjg5ODY2Ny01LjY3NDY2NyA1LjY3NDY2Ny01LjY3NDY2N2gxMTIuODk2di00My42MDUzMzNoLTExMy4xOTQ2NjdjLTMuNzc2IDAtNS42NzQ2NjctMS44NzczMzMtNS42NzQ2NjctNS42NzQ2Njd2LTE1MS43MjI2NjdjMC0zLjc3NiAxLjg5ODY2Ny01LjY3NDY2NyA1LjY3NDY2Ny01LjY3NDY2Nkg1MDkuODY2NjY3eiBtMjE3LjEzMDY2NiAwLjU5NzMzM2MzLjc3NiAwIDUuNjc0NjY3IDEuOTIgNS42NzQ2NjcgNS42NzQ2Njd2MjQ2LjY5ODY2NmMwIDMuNzk3MzMzLTEuODk4NjY3IDUuNjc0NjY3LTUuNjc0NjY3IDUuNjc0NjY3aC0xNzEuNDM0NjY2Yy0zLjc3NiAwLTUuNjc0NjY3LTEuODc3MzMzLTUuNjc0NjY3LTUuNjc0NjY3VjM2OS41MTQ2NjdjMC0zLjc3NiAxLjg5ODY2Ny01LjY3NDY2NyA1LjY3NDY2Ny01LjY3NDY2N2gxNzEuNDM0NjY2eiBtLTU3Ljk0MTMzMyA1My43NmgtNTUuMjUzMzMzdjE1MC41MjhoNTUuMjUzMzMzdi0xNTAuNTI4eiBtLTIxNy40MjkzMzMtMC41OTczMzNoLTU1LjI1MzMzNHY1NS44NTA2NjZoNTUuMjUzMzM0di01NS44NTA2NjZ6IiBwLWlkPSI0NjA0Ij48L3BhdGg+PC9zdmc+",
    pivotX: .5,
    pivotY: 0,
    offsetX: 0,
    offsetY: 0,
    width: 30,
    height: 30,
  }
}


interface IData {
  resultCanvas: any
  resultContext: CanvasRenderingContext2D

  backgroundCanvas: any
  backgroundContext: CanvasRenderingContext2D

  mixerCanvas: any
  mixerContext: CanvasRenderingContext2D

  operateCanvas: any
  operateContext: CanvasRenderingContext2D

  /** 操作层宽度、高度 */
  operateWidth: number
  operateHeight: number

  pictures: Picture[]

  /** 操作的图 */
  pictureOperatedIndex: number
  /** 操作的点 */
  picturePointOperatedIndex: number
  /** 点的半径 */
  pointRaduis: number
  /** 点的颜色 */
  pointColor: string
  /** 线的颜色 */
  lineColor: string
  /** 线的宽度 */
  lineWidth: number
  /** 限制的渲染时间 ms */
  renderInterval: number
  /** 操作的模式 */
  operatedMode: PictureOpMode
  /** 移动开始接触的坐标 */
  moveTouchStart: Vector2
  /** 移动开始的坐标 */
  moveStart: Vector2
  /** 移动点的对角点坐标 */
  moveDiagonal: Vector2
  /** 移动范围模式 */
  moveLimitMode: keyof IPictureMixerConfigMoveLimitMode
  /** 移除图像 */
  removeImage: CanvasImageSource
  /** 移除图像 */
  removePicture: Picture
  /** 旋转图像 */
  rotateImage: CanvasImageSource
  /** 旋转图像 */
  rotatePicture: Picture
  /** 计算间隔时间 */
  lasttime: number

}





Component({
  properties: {
    /** 配置 */
    config: Object
  },
  data: {
    resultCanvas: null,
    resultContext: null,
    backgroundCanvas: null,
    backgroundContext: null,
    mixerCanvas: null,
    mixerContext: null,
    operateCanvas: null,
    operateContext: null,
    operateWidth: 0,
    operateHeight: 0,
    pictures: [],
    pictureOperatedIndex: -1,
    picturePointOperatedIndex: -1,
    pointRaduis: 0,
    pointColor: '',
    lineColor: '',
    lineWidth: 0,
    renderInterval: 0,
    operatedMode: PictureOpMode.none,
    moveTouchStart: null,
    moveDiagonal: null,
    moveLimitMode: 'none',
    removeImage: null,
    removePicture: null,
    rotateImage: null,
    rotatePicture: null,
    lasttime: 0
  } as IData,
  lifetimes: {
    ready() {

      const dpr = wx.getSystemInfoSync().pixelRatio

      let config: IPictureMixerConfig = this.properties.config;


      let pointRaduis = config?.point?.raduis ?? defaultConfig.point.raduis
      let pointColor = config?.point?.color ?? defaultConfig.point.color;

      let lineColor = config?.line?.color ?? defaultConfig.line.color;
      let lineWidth = config?.line?.width ?? defaultConfig.line.width;
      let renderInterval = config?.renderInterval ?? defaultConfig.renderInterval

      let moveLimitMode = config?.move?.limitMode ?? defaultConfig.move?.limitMode;

      let definition = config?.definition ?? defaultConfig.definition

      this.data.pointRaduis = pointRaduis;
      this.data.pointColor = pointColor;
      this.data.lineColor = lineColor;
      this.data.lineWidth = lineWidth;
      this.data.renderInterval = renderInterval;
      this.data.moveLimitMode = moveLimitMode


      const q = this.createSelectorQuery();

      q.select('#result').fields({ node: true, size: true })
      q.select('#background').fields({ node: true, size: true })
      q.select('#mixer').fields({ node: true, size: true })
      q.select('#operate').fields({ node: true, size: true })
      q.exec(async (res) => {
        const resultCanvas = res[0].node;
        const backgroundCanvas = res[1].node;
        const mixerCanvas = res[2].node;
        const operateCanvas = res[3].node;

        const operateWidth = res[0].width;
        const operateHeight = res[0].height;


        const resultContext = resultCanvas.getContext('2d');
        const backgroundContext = backgroundCanvas.getContext('2d')
        const mixerContext = mixerCanvas.getContext('2d')
        const operateContext = operateCanvas.getContext('2d')



        resultCanvas.width = operateWidth * dpr * definition
        backgroundCanvas.width = operateWidth * dpr * definition
        mixerCanvas.width = operateWidth * dpr * definition
        operateCanvas.width = operateWidth * dpr * definition


        resultCanvas.height = operateHeight * dpr * definition
        backgroundCanvas.height = operateHeight * dpr * definition
        mixerCanvas.height = operateHeight * dpr * definition
        operateCanvas.height = operateHeight * dpr * definition

        resultContext.scale(dpr * definition, dpr * definition);
        backgroundContext.scale(dpr * definition, dpr * definition);
        mixerContext.scale(dpr * definition, dpr * definition);
        operateContext.scale(dpr * definition, dpr * definition);


        this.data.resultCanvas = resultCanvas;
        this.data.resultContext = resultContext;
        this.data.backgroundCanvas = backgroundCanvas
        this.data.backgroundContext = backgroundContext
        this.data.mixerCanvas = mixerCanvas;
        this.data.mixerContext = mixerContext;
        this.data.operateCanvas = operateCanvas;
        this.data.operateContext = operateContext;

        this.data.operateWidth = operateWidth;
        this.data.operateHeight = operateHeight;



        let removeUrl = config?.remove?.url ?? defaultConfig.remove.url;
        let removeImage = await createImage(mixerCanvas, removeUrl)

        let rotateUrl = config?.rotate?.url ?? defaultConfig.rotate.url;
        let rotateImage = await createImage(mixerCanvas, rotateUrl)

        this.data.removeImage = removeImage;
        this.data.rotateImage = rotateImage;

        this.render();
        this.showWatermark();

        this.triggerEvent("loaded", {
          backgroundContext: backgroundContext,
          width: operateWidth,
          height: operateHeight
        })
      });
    }
  },
  methods: {
    async watermark() {
      let config = this.properties.config;
      let allowWatermark: Boolean = config?.allowWatermark ?? defaultConfig.allowWatermark;
      if (!allowWatermark) return;
      let data: IData = this.data;
      let watermarkUrl = config?.watermark?.url ?? defaultConfig.watermark?.url;
      let watermarkImage = await createImage(data.operateCanvas, watermarkUrl)
      let watermarkWidth = config?.watermark?.width ?? defaultConfig.watermark.width;
      let watermarkHeight = config?.watermark?.height ?? defaultConfig.watermark.height;
      let watermarkPivotX = config?.watermark?.pivotX ?? defaultConfig.watermark.pivotX;
      let watermarkPivotY = config?.watermark?.pivotY ?? defaultConfig.watermark.pivotY;
      let watermarkX = data.operateWidth * watermarkPivotX - (config?.watermark?.offsetX ?? defaultConfig.watermark.offsetX) - watermarkWidth / 2;
      let watermarkY = data.operateHeight * watermarkPivotY - (config?.watermark?.offsetY ?? defaultConfig.watermark.offsetY) - watermarkHeight / 2;
      data.operateContext.drawImage(watermarkImage, watermarkX, watermarkY, watermarkWidth, watermarkHeight);
      this.data.watermarkImage = watermarkImage;
    },
    /**
     * @deprecated change watermark()
     */
    async showWatermark() {
      await this.watermark();
    },
    render() {
      let config: IPictureMixerConfig = this.properties.config;
      let data: IData = this.data;
      let pictures = data.pictures;
      let { operateContext, mixerContext, lineColor, pointColor, lineWidth, pointRaduis, removeImage, rotateImage } = data;

      let allowScale: boolean = config?.allowScale ?? defaultConfig.allowScale
      let allowRemove: boolean = config?.allowRemove ?? defaultConfig.allowRemove
      let allowRotate: boolean = config?.allowRotate ?? defaultConfig.allowRotate

      operateContext.clearRect(0, 0, data.operateWidth, data.operateHeight)
      mixerContext.clearRect(0, 0, data.operateWidth, data.operateHeight)

      // 按顺序加载图片内容
      for (let i = 0; i < pictures.length; i++) {
        const picture = pictures[i];
        mixerContext.drawImage(picture.img, picture.x, picture.y, picture.width, picture.height);
      }
      // 给索引增加可操作点
      if (data.pictureOperatedIndex != -1) {

        const picture: Picture = pictures[data.pictureOperatedIndex];
        operateContext.beginPath();
        operateContext.strokeStyle = lineColor;
        operateContext.lineWidth = lineWidth;
        operateContext.fillStyle = pointColor;

        for (let i = 0; i < picture.points.length; i++) {
          let tmp = picture.points[i];
          i == 0 ? operateContext.moveTo(tmp.x, tmp.y) : operateContext.lineTo(tmp.x, tmp.y)
        }
        operateContext.closePath();
        operateContext.stroke()

        if (allowScale) {
          // 点
          for (let i = 0; i < picture.points.length; i++) {
            operateContext.lineWidth = 1;
            let tmp = picture.points[i];
            operateContext.beginPath();
            operateContext.arc(tmp.x, tmp.y, pointRaduis - 1, 0, 2 * Math.PI);
            operateContext.stroke();
            operateContext.fill();
          }
        }

        /** 允许删除 */
        if (allowRemove) {
          let removeWidth = config?.remove?.width ?? defaultConfig.remove.width;
          let removeHeight = config?.remove?.height ?? defaultConfig.remove.height;
          let removePivotX = config?.remove?.pivotX ?? defaultConfig.remove.pivotX;
          let removePivotY = config?.remove?.pivotY ?? defaultConfig.remove.pivotY;
          let removeX = picture.x + picture.width * removePivotX - (config?.remove?.offsetX ?? defaultConfig.remove.offsetX) - removeWidth / 2;
          let removeY = picture.y + picture.height * removePivotY - (config?.remove?.offsetY ?? defaultConfig.remove.offsetY) - removeHeight / 2;

          let removePicture = new Picture();
          removePicture.img = removeImage;
          removePicture.x = removeX;
          removePicture.y = removeY;
          removePicture.width = removeWidth;
          removePicture.height = removeHeight;
          this.data.removePicture = removePicture
          operateContext.drawImage(removeImage, removeX, removeY, removeWidth, removeHeight);
        }

        if (allowRotate) {
          let rotateWidth = config?.rotate?.width ?? defaultConfig.rotate.width;
          let rotateHeight = config?.rotate?.height ?? defaultConfig.rotate.height;
          let rotatePivotX = config?.rotate?.pivotX ?? defaultConfig.rotate.pivotX;
          let rotatePivotY = config?.rotate?.pivotY ?? defaultConfig.rotate.pivotY;
          let pictureWidth = picture.width;
          let pictureHeight = picture.height;


          let rotateX = picture.x + pictureWidth * rotatePivotX - (config?.rotate?.offsetX ?? defaultConfig.rotate.offsetX) - rotateWidth / 2;
          let rotateY = picture.y + pictureHeight * rotatePivotY - (config?.rotate?.offsetY ?? defaultConfig.rotate.offsetY) - rotateHeight / 2;


          let rotatePicture = new Picture();
          rotatePicture.img = rotateImage;
          rotatePicture.x = rotateX;
          rotatePicture.y = rotateY;
          rotatePicture.width = rotateWidth;
          rotatePicture.height = rotateHeight;
          this.data.rotatePicture = rotatePicture
          operateContext.drawImage(rotateImage, rotateX, rotateY, rotateWidth, rotateHeight);
        }
      };
      this.triggerEvent("render", {
        pictures: pictures,
      })
    },
    async touchstart(e) {
      let config: IPictureMixerConfig = this.properties.config;
      let data: IData = this.data;



      let { x, y } = e.changedTouches[0]
      let {
        operateCanvas,
        mixerCanvas,
        removePicture,
        rotatePicture,
        pictureOperatedIndex,
        picturePointOperatedIndex,
        moveTouchStart,
        pictures,
        moveLimitMode,
        pointRaduis,
        operateWidth,
        operateHeight
      } = data;



      // 允许缩放
      let allowScale: boolean = config?.allowScale ?? defaultConfig.allowScale
      let allowRemove: boolean = config?.allowRemove ?? defaultConfig.allowRemove
      let allowRotate: boolean = config?.allowRotate ?? defaultConfig.allowRotate

      // 自动设置置顶
      let allowAutoSetTop: boolean = config?.allowAutoSetTop ?? defaultConfig.allowAutoSetTop

      moveTouchStart = Vector2.c(x, y);
      this.data.moveTouchStart = moveTouchStart;
      this.data.operatedMode = PictureOpMode.none;

      // 删除
      if (allowRemove) {
        if (pictureOperatedIndex != -1 && Vector2.checkInRectangle(Vector2.c(x, y), removePicture.points[0], removePicture.points[1], removePicture.points[2])) {
          pictures.splice(pictureOperatedIndex, 1);
          pictureOperatedIndex = -1;
          this.data.pictureOperatedIndex = pictureOperatedIndex;
          this.triggerEvent("change", { pictures: pictures })
        }
        // 如果删除的只剩一张也去展示下水印
        if (pictures.length == 0) this.showWatermark();
      }

      // 旋转 90°
      if (allowRotate && this.data.operatedMode == PictureOpMode.none) {
        if (pictureOperatedIndex != -1 && Vector2.checkInRectangle(Vector2.c(x, y), rotatePicture.points[0], rotatePicture.points[1], rotatePicture.points[2])) {
          this.data.operatedMode = PictureOpMode.rotate;
          const picture = pictures[pictureOperatedIndex];


          const width = picture.width;
          const height = picture.height;

          // 中心点旋转逻辑
          const centerX = picture.x + picture.width / 2
          const centerY = picture.y + picture.height / 2
          const rp: IRotatePictureRotateRes = await this.selectComponent("#rp").rotate({ image: picture.img, angle: 90 })
          picture.img = await createImage(mixerCanvas, rp.base64);
          picture.x = centerX - height / 2;
          picture.y = centerY - width / 2;
          picture.width = height;
          picture.height = width;
          picture.angle += 90;

          if (moveLimitMode == 'picture') {
            if (picture.x < 0) picture.x = 0;
            if (picture.y < 0) picture.y = 0;
            if (picture.x + picture.width > operateWidth) picture.x = operateWidth - picture.width;
            if (picture.y + picture.height > operateHeight) picture.y = operateHeight - picture.height;
          }
          else if (moveLimitMode == 'point') {
            if (picture.x < pointRaduis) picture.x = pointRaduis;
            if (picture.y < pointRaduis) picture.y = pointRaduis;
            if (picture.x + pointRaduis + picture.width > operateWidth) picture.x = operateWidth - picture.width - pointRaduis;
            if (picture.y + pointRaduis + picture.height > operateHeight) picture.y = operateHeight - picture.height - pointRaduis;
          }

          this.triggerEvent("change", { pictures: pictures })
        }
      }

      // 判断是否缩放图片
      if (pictureOperatedIndex != -1 && allowScale && this.data.operatedMode == PictureOpMode.none) {
        const picture = pictures[pictureOperatedIndex];
        picturePointOperatedIndex = - 1;
        for (let i = 0; i < picture.points.length; i++) {
          const p = picture.points[i];
          if (Vector2.distance(moveTouchStart, p) < pointRaduis) {
            picturePointOperatedIndex = i;
            this.data.operatedMode = PictureOpMode.scale;
            this.data.moveStart = Vector2.c(p.x, p.y);
            this.data.moveTouchStart = Vector2.c(p.x, p.y);
            this.data.moveDiagonal = Vector2.c(picture.points[(i + 2) % 4].x, picture.points[(i + 2) % 4].y)
            break;
          }
        }
        this.data.picturePointOperatedIndex = picturePointOperatedIndex
      }



      // 判断是否移动图片   
      if (pictures.length > 0 && picturePointOperatedIndex == -1 && this.data.operatedMode == PictureOpMode.none) {
        pictureOperatedIndex = -1;
        for (let i = pictures.length - 1; i >= 0; i--) {
          const picture: Picture = pictures[i];
          if (Vector2.checkInRectangle(Vector2.c(x, y), picture.points[0], picture.points[1], picture.points[2])) {
            pictureOperatedIndex = i;
            this.data.operatedMode = PictureOpMode.move;
            this.data.moveStart = Vector2.c(picture.x, picture.y);
            break;
          }
        }
        // 交换位置
        if (allowAutoSetTop && pictureOperatedIndex != -1 && pictureOperatedIndex != pictures.length - 1) {
          let tmp = pictures[pictureOperatedIndex];
          pictures[pictureOperatedIndex] = pictures[pictures.length - 1];
          pictures[pictures.length - 1] = tmp;
          pictureOperatedIndex = pictures.length - 1;
        }
        this.data.pictureOperatedIndex = pictureOperatedIndex;
      }

      this.render()
    },
    touchmove(e) {
      let config: IPictureMixerConfig = this.properties.config
      let data: IData = this.data;
      let { pictureOperatedIndex, pictures, picturePointOperatedIndex, moveStart, lasttime, renderInterval, operateWidth, operateHeight, moveLimitMode, pointRaduis }: IData = data;
      if (pictureOperatedIndex == -1 || timestamp() - lasttime < renderInterval) return;
      this.data.lasttime = timestamp();

      /** 手指拖动的位置 */
      let { x, y } = e.changedTouches[0]


      /** 移动点开始的坐标 */
      let moveTouchStart: Vector2 = this.data.moveTouchStart;
      /** 缩放模式 */
      let scaleMode: keyof IPictureMixerConfigScaleMode = config?.scale?.mode ?? defaultConfig.scale?.mode
      /** 缩放最小比例 */
      let scaleMinRatio: number = config?.scale?.minRatio ?? defaultConfig.scale?.minRatio

      let rp: Vector2 = this.limitPoint(x, y)

      x = rp.x;
      y = rp.y;

      let picture: Picture = pictures[pictureOperatedIndex];

      if (data.operatedMode == PictureOpMode.move) {
        picture.x = moveStart.x + x - moveTouchStart.x;
        picture.y = moveStart.y + y - moveTouchStart.y;

        if (moveLimitMode == 'picture') {
          if (picture.x < 0) picture.x = 0;
          if (picture.y < 0) picture.y = 0;
          if (picture.x + picture.width > operateWidth) picture.x = operateWidth - picture.width;
          if (picture.y + picture.height > operateHeight) picture.y = operateHeight - picture.height;
        }
        else if (moveLimitMode == 'point') {
          if (picture.x < pointRaduis) picture.x = pointRaduis;
          if (picture.y < pointRaduis) picture.y = pointRaduis;
          if (picture.x + pointRaduis + picture.width > operateWidth) picture.x = operateWidth - picture.width - pointRaduis;
          if (picture.y + pointRaduis + picture.height > operateHeight) picture.y = operateHeight - picture.height - pointRaduis;
        }
      }
      else if (data.operatedMode == PictureOpMode.scale) {
        let point: Vector2 = picture.points[picturePointOperatedIndex]
        let diagonal: Vector2 = data.moveDiagonal;


        point.x = moveStart.x + x - moveTouchStart.x;
        point.y = moveStart.y + y - moveTouchStart.y;

        rp = this.limitPoint(point.x, point.y);
        point.x = rp.x;
        point.y = rp.y;

        /** 左上 */
        if (picturePointOperatedIndex == 0) {
          picture.x = point.x;
          picture.width = diagonal.x - picture.x;
          picture.y = point.y;
          picture.height = diagonal.y - picture.y;

          if (scaleMode == 'ratio') {
            if (picture.width < scaleMinRatio * picture.initialWidth) {
              picture.width = scaleMinRatio * picture.initialWidth
              picture.x = diagonal.x - picture.width;
            }
            picture.height = picture.width * picture.initialHeight / picture.initialWidth;
            picture.y = diagonal.y - picture.height;

            rp = this.limitPoint(picture.x, picture.y);
            picture.y = rp.y;
            picture.height = diagonal.y - picture.y;
            picture.width = picture.height * picture.initialWidth / picture.initialHeight;
            picture.x = diagonal.x - picture.width;
          }


          if (picture.width < pointRaduis * 2) {
            picture.width = pointRaduis * 2;
            picture.x = diagonal.x - picture.width;
          }
          if (picture.height < pointRaduis * 2) {
            picture.height = pointRaduis * 2;
            picture.y = diagonal.y - picture.height
          }
        }
        /** 右上 */
        else if (picturePointOperatedIndex == 1) {
          picture.x = diagonal.x;
          picture.y = point.y;
          picture.width = point.x - diagonal.x;
          picture.height = diagonal.y - point.y;

          if (scaleMode == "ratio") {
            if (picture.width < scaleMinRatio * picture.initialWidth) {
              picture.width = scaleMinRatio * picture.initialWidth
            }
            picture.height = picture.width * picture.initialHeight / picture.initialWidth;
            picture.y = diagonal.y - picture.height;

            rp = this.limitPoint(picture.x + picture.width, picture.y);
            picture.y = rp.y;
            picture.height = diagonal.y - picture.y;
            picture.width = picture.height * picture.initialWidth / picture.initialHeight;
            picture.x = diagonal.x;
          }


          if (picture.width < pointRaduis * 2) {
            picture.width = pointRaduis * 2;
          }
          if (picture.height < pointRaduis * 2) {
            picture.height = pointRaduis * 2;
            picture.y = diagonal.y - picture.height
          }
        }
        /** 右下 */
        else if (picturePointOperatedIndex == 2) {
          picture.x = diagonal.x;
          picture.y = diagonal.y;
          picture.width = point.x - diagonal.x;
          picture.height = point.y - diagonal.y;

          if (scaleMode == "ratio") {
            if (picture.width < scaleMinRatio * picture.initialWidth) {
              picture.width = scaleMinRatio * picture.initialWidth
            }
            picture.height = picture.width * picture.initialHeight / picture.initialWidth;
            rp = this.limitPoint(picture.x + picture.width, picture.y + picture.height);
            picture.height = rp.y - diagonal.y;
            picture.width = picture.height * picture.initialWidth / picture.initialHeight;
          }



          if (picture.width < pointRaduis * 2) {
            picture.width = pointRaduis * 2;
          }
          if (picture.height < pointRaduis * 2) {
            picture.height = pointRaduis * 2;
          }

        }
        /** 左下 */
        else if (picturePointOperatedIndex == 3) {
          picture.x = point.x;
          picture.y = diagonal.y;
          picture.width = -point.x + diagonal.x;
          picture.height = point.y - diagonal.y;


          if (scaleMode == "ratio") {
            if (picture.width < scaleMinRatio * picture.initialWidth) {
              picture.width = scaleMinRatio * picture.initialWidth
              picture.x = diagonal.x - picture.width;
            }
            picture.height = picture.width * picture.initialHeight / picture.initialWidth;

            rp = this.limitPoint(picture.x, picture.y + picture.height);

            picture.height = rp.y - diagonal.y;
            picture.width = picture.height * picture.initialWidth / picture.initialHeight;
            picture.x = diagonal.x - picture.width;
          }



          if (picture.width < pointRaduis * 2) {
            picture.width = pointRaduis * 2;
            picture.x = diagonal.x - picture.width;
          }
          if (picture.height < pointRaduis * 2) {
            picture.height = pointRaduis * 2;
          }

        }

      }

      this.render();
    },
    /**
     * 添加图片
     * @param url 图片地址
     */
    async add(url: string) {
      let config: IPictureMixerConfig = this.properties.config;
      let data: IData = this.data;

      let { pictures, mixerCanvas, operateCanvas } = data;

      let addCount: number = config?.add?.count ?? defaultConfig.add?.count;
      let addScaleWidth: number = config?.add?.scaleWidth ?? defaultConfig.add?.scaleWidth;
      let addScaleHeight: number = config?.add?.scaleHeight ?? defaultConfig.add?.scaleHeight;

      if (pictures.length >= addCount) throw { err_code: 1000, err_message: "上传图片数量超出限制" };

      let image = await createImage(mixerCanvas, url)

      let { ow, oh } = scaling(+image.width, +image.height, data.operateWidth * addScaleWidth, data.operateHeight * addScaleHeight)
      let p = new Picture(data.operateWidth / 2 - ow / 2, data.operateHeight / 2 - oh / 2, ow, oh);
      p.url = url;
      p.img = image;
      pictures.push(p);
      this.data.pictureOperatedIndex = pictures.length - 1;
      this.data.pictures = pictures;

      this.render();

      this.triggerEvent("change", { pictures: pictures })

    },
    async save(p?: IPictureMixerSaveParams): Promise<IPictureMixerSaveResult> {
      let config: IPictureMixerConfig = this.properties.config;
      let data: IData = this.data;

      let type = p?.type ?? config?.save?.type ?? defaultConfig?.save?.type;
      let encoderOptions = p?.encoderOptions ?? config?.save?.encoderOptions ?? defaultConfig?.save?.encoderOptions;
      let background = config?.background ?? defaultConfig.background;


      let { pictures, resultContext, resultCanvas, operateWidth, operateHeight } = data

      resultContext.clearRect(0, 0, operateWidth, operateHeight)
      resultContext.fillStyle = background;
      resultContext.fillRect(0, 0, operateWidth, operateHeight)

      // 按顺序加载图片内容
      for (let i = 0; i < pictures.length; i++) {
        const picture = pictures[i];
        resultContext.drawImage(picture.img, picture.x, picture.y, picture.width, picture.height);
      }

      return new Promise(async (resolve, reject) => {
        try {
          let base64 = resultCanvas.toDataURL(type, encoderOptions);
          resultContext.clearRect(0, 0, operateWidth, operateHeight)
          let tempFilePath = await base64ToTempFilePath(base64)
          resolve({
            base64,
            tempFilePath,
            width: operateWidth,
            height: operateHeight
          })
        } catch (error) {
          reject(error)
        }
      })

    },

    limitPoint(x: number, y: number) {
      let { moveLimitMode, pointRaduis, operateWidth, operateHeight }: IData = this.data;
      /** 当为图片时 */
      if (moveLimitMode == 'picture') {
        if (x < 0) x = 0
        if (y < 0) y = 0
        if (x > operateWidth) x = operateWidth;
        if (y > operateHeight) y = operateHeight;
      }
      /** 当为点时 */
      else if (moveLimitMode == 'point') {
        if (x < pointRaduis) x = pointRaduis
        if (y < pointRaduis) y = pointRaduis
        if (x > operateWidth - pointRaduis) x = operateWidth - pointRaduis;
        if (y > operateHeight - pointRaduis) y = operateHeight - pointRaduis;
      }
      return Vector2.c(x, y)
    }
  }
})
