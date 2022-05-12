import { Vector2 } from "ru-toolkit-mathematics"
/**
 * 图片混合器配置
 */
export interface IPictureMixerConfig {
  /** 1.0.1 用于改变图片清晰度 尽量不要太大 */
  definition?: number
  /** 渲染间隔 ms */
  renderInterval?: number
  /** 允许缩放 写的很烂 */
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
  /**
   * 1.0.3 允许展示水印
   * 仅在无图的时候展示
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
  },
  /** 1.0.2 保存默认值 */
  save?: {} & IPictureMixerSaveParams
  /** 1.0.3 水印图片 */
  watermark?: {
    /** 图片地址 */
    url?: string
    /** 轴心点 0~1 */
    pivotX?: number,
    pivotY?: number,
    offsetX?: number,
    offsetY?: number
    width?: number
    height?: number,
  },

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
  img: IPictureImg
  /** 初始值 */
  i_x: number
  i_y: number
  i_width: number
  i_height: number

  constructor(x?: number, y?: number, width?: number, height?: number) {
    this.i_x = this.x = x;
    this.i_y = this.y = y;
    this.i_width = this.width = width;
    this.i_height = this.height = height;
  }
  /**
   * 获取四个点坐标
   */
  get points(): Vector2[] {
    return [
      Vector2.c(this.x, this.y),
      Vector2.c(this.x + this.width, this.y),
      Vector2.c(this.x + this.width, this.y + this.height),
      Vector2.c(this.x, this.y + this.height),
    ]
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
  }
}
/**
 * 缩放
 * @param ow 源图宽 
 * @param oh 源图高
 * @param tw 目标宽
 * @param th 目标高
 */
const scaling = (ow: number, oh: number, tw: number, th: number) => {
  let s = 0;
  if (ow > oh) {
    s = ow / oh;
    ow = tw;
    oh = ow / s
  }
  else {
    s = ow / oh;
    oh = th;
    ow = oh * s
  }

  if (th < oh) {
    s = ow / oh;
    oh = th;
    ow = oh * s
  }

  if (tw < ow) {
    s = ow / oh;
    ow = tw;
    oh = ow / s
  }
  return { ow, oh }
}
/**
 * 获取临时图片
 * @param base64 
 * @returns 
 */
const base64ToTempFilePath = (base64: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fs = wx.getFileSystemManager();
    const times = new Date().getTime();
    const tempFilePath = wx.env.USER_DATA_PATH + '/' + times + '.png';
    fs.writeFile({
      filePath: tempFilePath,
      data: base64.split(',')[1],
      encoding: 'base64',
      success: (res) => {
        resolve(tempFilePath)
      },
      fail: (err) => {
        reject(err)
      }
    });
  })
}
/**
 * 获取时间戳
 */
const timestamp = () => {
  return new Date().getTime();
}
Component({
  properties: {
    /** 配置 */
    config: Object
  },
  data: {
    m_result_canvas: null,
    m_result_context: null,
    m_background_canvas: null,
    m_background_context: null,
    m_mixer_canvas: null,
    m_mixer_context: null,
    m_operate_canvas: null,
    m_operate_context: null,

    r_width: 0,
    r_height: 0,

    m_pictures: [] as Picture[],
    m_picture_op: -1,
    m_picture_point_op: -1,
    m_point_raduis: 0,
    m_point_color: "",
    m_line_color: "",
    m_line_width: 0,
    m_render_interval: 0, // 限制的渲染时间
    m_op_mode: PictureOpMode.none, // 操作的模式
    m_move_touch_start: null, // 移动开始接触的坐标
    m_move_start: null, // 移动开始的坐标
    m_move_diagonal: null, // 移动点的对角点坐标
    m_move_limit_mode: "", // 移动范围模式
    m_remove_img: null, // 移除图像
    m_remove_pic: null,

    lasttime: 0, // 计算间隔时间
  },
  lifetimes: {
    ready() {

      const dpr = wx.getSystemInfoSync().pixelRatio

      let config = this.properties.config;

      let m_point_raduis = config?.point?.raduis || defaultConfig.point.raduis
      let m_point_color = config?.point?.color || defaultConfig.point.color;

      let m_line_color = config?.line?.color || defaultConfig.line.color;
      let m_line_width = config?.line?.width || defaultConfig.line.width;
      let m_render_interval = config?.renderInterval || defaultConfig.renderInterval

      let m_scale_min_width = config?.scale?.minWidth || defaultConfig.scale.minWidth;
      let m_scale_min_height = config?.scale?.minHeight || defaultConfig.scale.minHeight;

      let m_move_limit_mode = config?.move?.limitMode || defaultConfig.move?.limitMode;

      let m_remove_url = config?.remove?.url || defaultConfig.remove?.url;

      let m_definition: number = config?.definition || defaultConfig.definition

      this.data.m_point_raduis = m_point_raduis;
      this.data.m_point_color = m_point_color;
      this.data.m_line_color = m_line_color;
      this.data.m_line_width = m_line_width;
      this.data.m_render_interval = m_render_interval;
      this.data.m_scale_min_width = m_scale_min_width;
      this.data.m_scale_min_height = m_scale_min_height;
      this.data.m_move_limit_mode = m_move_limit_mode


      const q = this.createSelectorQuery();

      q.select('#result').fields({ node: true, size: true })
      q.select('#background').fields({ node: true, size: true })
      q.select('#mixer').fields({ node: true, size: true })
      q.select('#operate').fields({ node: true, size: true })
      q.exec((res) => {


        const m_result_canvas = res[0].node;
        const m_background_canvas = res[1].node;
        const m_mixer_canvas = res[2].node;
        const m_operate_canvas = res[3].node;

        const r_width = res[0].width;
        const r_height = res[0].height;


        const m_result_context = m_result_canvas.getContext('2d');
        const m_background_context = m_background_canvas.getContext('2d')
        const m_mixer_context = m_mixer_canvas.getContext('2d')
        const m_operate_context = m_operate_canvas.getContext('2d')



        m_result_canvas.width = r_width * dpr * m_definition
        m_background_canvas.width = r_width * dpr * m_definition
        m_mixer_canvas.width = r_width * dpr * m_definition
        m_operate_canvas.width = r_width * dpr * m_definition


        m_result_canvas.height = r_height * dpr * m_definition
        m_background_canvas.height = r_height * dpr * m_definition
        m_mixer_canvas.height = r_height * dpr * m_definition
        m_operate_canvas.height = r_height * dpr * m_definition

        m_result_context.scale(dpr * m_definition, dpr * m_definition);
        m_background_context.scale(dpr * m_definition, dpr * m_definition);
        m_mixer_context.scale(dpr * m_definition, dpr * m_definition);
        m_operate_context.scale(dpr * m_definition, dpr * m_definition);


        this.data.m_result_canvas = m_result_canvas;
        this.data.m_result_context = m_result_context;
        this.data.m_background_canvas = m_background_canvas
        this.data.m_background_context = m_background_context
        this.data.m_mixer_canvas = m_mixer_canvas;
        this.data.m_mixer_context = m_mixer_context;
        this.data.m_operate_canvas = m_operate_canvas;
        this.data.m_operate_context = m_operate_context;

        this.data.r_width = r_width;
        this.data.r_height = r_height;



        let m_remove_img = m_mixer_canvas.createImage();
        m_remove_img.src = m_remove_url;
        m_remove_img.onload = () => {
          this.data.m_remove_img = m_remove_img;
        }

        this.render();
        this.showWatermark();

        this.triggerEvent("loaded", {
          background_context: m_background_context,
          width: r_width,
          height: r_height
        })
      });
    }
  },
  methods: { 
    showWatermark() {
      let config = this.properties.config;
      let allow_watermark: Boolean = config?.allowWatermark || defaultConfig.allowWatermark;
      if (!allow_watermark) return;
      let m_operate_context: CanvasRenderingContext2D = this.data.m_operate_context;
      let m_operate_canvas = this.data.m_operate_canvas;
      let m_watermark_url = config?.watermark?.url || defaultConfig.watermark?.url;
      let r_width: number = this.data.r_width
      let r_height: number = this.data.r_height
      let m_watermark_img = m_operate_canvas.createImage();
      m_watermark_img.src = m_watermark_url;
      m_watermark_img.onload = () => {
        this.data.m_watermark_img = m_watermark_img;
        let watermark_width = config?.watermark?.width || defaultConfig.watermark.width;
        let watermark_height = config?.watermark?.height || defaultConfig.watermark.height;
        let watermark_pivotX = config?.watermark?.pivotX || defaultConfig.watermark.pivotX;
        let watermark_pivotY = config?.watermark?.pivotY || defaultConfig.watermark.pivotY;
        let watermark_x = r_width * watermark_pivotX - (config?.watermark?.offsetX || defaultConfig.watermark.offsetX) - watermark_width / 2;
        let watermark_y = r_height * watermark_pivotY - (config?.watermark?.offsetY || defaultConfig.watermark.offsetY) - watermark_height / 2;
        m_operate_context.drawImage(m_watermark_img, watermark_x, watermark_y, watermark_width, watermark_height);
      }
    },
    render() {
      let config = this.properties.config;
      let { m_operate_context, m_mixer_canvas, m_watermark_img, m_remove_img, m_line_color, m_line_width, m_point_raduis, m_point_color, r_width, r_height, m_mixer_context, m_pictures, m_picture_op } = this.data

      let allow_scale: boolean = config?.allowScale || defaultConfig.allowScale
      let allow_remove: boolean = config?.allowRemove || defaultConfig.allowRemove

      m_operate_context.clearRect(0, 0, r_width, r_height)
      m_mixer_context.clearRect(0, 0, r_width, r_height)

      // 按顺序加载图片内容
      for (let i = 0; i < m_pictures.length; i++) {
        const picture = m_pictures[i];
        m_mixer_context.drawImage(picture.img, picture.x, picture.y, picture.width, picture.height);
      }
      // 给索引增加可操作点
      if (m_picture_op != -1) {
        const picture: Picture = m_pictures[m_picture_op];
        m_operate_context.beginPath();
        m_operate_context.strokeStyle = m_line_color;
        m_operate_context.lineWidth = m_line_width;
        m_operate_context.fillStyle = m_point_color;

        for (let i = 0; i < picture.points.length; i++) {
          let tmp = picture.points[i];
          i == 0 ? m_operate_context.moveTo(tmp.x, tmp.y) : m_operate_context.lineTo(tmp.x, tmp.y)
        }
        m_operate_context.closePath();
        m_operate_context.stroke()

        if (allow_scale) {
          // 点
          for (let i = 0; i < picture.points.length; i++) {
            m_operate_context.lineWidth = 1;
            let tmp = picture.points[i];
            m_operate_context.beginPath();
            m_operate_context.arc(tmp.x, tmp.y, m_point_raduis - 1, 0, 2 * Math.PI);
            m_operate_context.stroke();
            m_operate_context.fill();
          }
        }

        /** 允许删除 */
        if (allow_remove) {
          let remove_width = config?.remove?.width || defaultConfig.remove.width;
          let remove_height = config?.remove?.height || defaultConfig.remove.height;
          let remove_pivotX = config?.remove?.pivotX || defaultConfig.remove.pivotX;
          let remove_pivotY = config?.remove?.pivotY || defaultConfig.remove.pivotY;
          let remove_x = picture.x + picture.width * remove_pivotX - (config?.remove?.offsetX || defaultConfig.remove.offsetX) - remove_width / 2;
          let remove_y = picture.y + picture.height * remove_pivotY - (config?.remove?.offsetY || defaultConfig.remove.offsetY) - remove_height / 2;

          let remove_pic = new Picture();
          remove_pic.img = m_remove_img;
          remove_pic.x = remove_x;
          remove_pic.y = remove_y;
          remove_pic.width = remove_width;
          remove_pic.height = remove_height;
          this.data.m_remove_pic = remove_pic
          // 删除图标
          m_operate_context.drawImage(m_remove_img, remove_x, remove_y, remove_width, remove_height);
        }

      };
      this.triggerEvent("render", {
        pictures: m_pictures,
      })
    },
    touchstart(e) {
      let config = this.properties.config;

      let { m_point_raduis, m_picture_op, m_picture_point_op } = this.data;
      // 允许缩放
      let allow_scale: boolean = config?.allowScale || defaultConfig.allowScale

      let allow_remove: boolean = config?.allowRemove || defaultConfig.allowRemove
      // 自动设置置顶
      let allow_auto_set_top: boolean = config?.allowAutoSetTop || defaultConfig.allowAutoSetTop

      let m_pictures: Picture[] = this.data.m_pictures;
      let { x, y } = e.changedTouches[0]

      let m_move_touch_start = Vector2.c(x, y);

      this.data.m_move_touch_start = m_move_touch_start;
      // 初始化
      this.data.m_op_mode = PictureOpMode.none;

      // 删除
      if (allow_remove) {
        let m_remove_pic: Picture = this.data.m_remove_pic;
        if (m_picture_op != -1 && Vector2.checkInRectangle(Vector2.c(x, y), m_remove_pic.points[0], m_remove_pic.points[1], m_remove_pic.points[2])) {
          m_pictures.splice(m_picture_op, 1);
          m_picture_op = -1;
          this.data.m_picture_op = m_picture_op;
          this.triggerEvent("change", {
            pictures: m_pictures,
          })
        }
        // 如果删除的只剩一张也去展示下水印
        if (m_pictures.length == 0) this.showWatermark();
      }
      // 判断是否缩放图片
      if (m_picture_op != -1 && allow_scale) {
        const picture = m_pictures[m_picture_op];
        m_picture_point_op = - 1;
        for (let i = 0; i < picture.points.length; i++) {
          const p = picture.points[i];
          if (Vector2.distance(m_move_touch_start, p) < m_point_raduis) {
            m_picture_point_op = i;
            this.data.m_op_mode = PictureOpMode.scale;
            this.data.m_move_start = Vector2.c(p.x, p.y);
            this.data.m_move_touch_start = Vector2.c(p.x, p.y);
            this.data.m_move_diagonal = Vector2.c(picture.points[(i + 2) % 4].x, picture.points[(i + 2) % 4].y)
            break;
          }
        }
        this.data.m_picture_point_op = m_picture_point_op
      }
      // 判断是否移动图片   
      if (m_pictures.length > 0 && m_picture_point_op == -1) {
        m_picture_op = -1;
        for (let i = m_pictures.length - 1; i >= 0; i--) {
          const picture: Picture = m_pictures[i];
          if (Vector2.checkInRectangle(Vector2.c(x, y), picture.points[0], picture.points[1], picture.points[2])) {
            m_picture_op = i;
            this.data.m_op_mode = PictureOpMode.move;
            this.data.m_move_start = Vector2.c(picture.x, picture.y);
            break;
          }
        }
        // 交换位置
        if (allow_auto_set_top && m_picture_op != -1 && m_picture_op != m_pictures.length - 1) {
          let tmp = m_pictures[m_picture_op];
          m_pictures[m_picture_op] = m_pictures[m_pictures.length - 1];
          m_pictures[m_pictures.length - 1] = tmp;
          m_picture_op = m_pictures.length - 1;
        }
        this.data.m_picture_op = m_picture_op;
      }
      this.render()
    },
    touchmove(e) {
      let config = this.properties.config
      let { m_picture_op, m_point_raduis, m_pictures, lasttime, m_render_interval, m_move_start, m_scale_min_width, m_scale_min_height } = this.data;
      if (m_picture_op == -1 || timestamp() - lasttime < m_render_interval) return;
      this.data.lasttime = timestamp();

      /** 真实的宽度 */
      let r_width: number = this.data.r_width;
      let r_height: number = this.data.r_height;
      /** 手指拖动的位置 */
      let x: number = e.changedTouches[0].x
      let y: number = e.changedTouches[0].y

      /** 极限模式 */
      let limitMode: keyof IPictureMixerConfigMoveLimitMode = this.data.m_move_limit_mode;
      /** 点的半径 */
      let pointRaduis: number = this.data.m_point_raduis;

      /** 移动点开始的坐标 */
      let moveTouchStart: Vector2 = this.data.m_move_touch_start;
      /** 缩放模式 */
      let scaleMode: keyof IPictureMixerConfigScaleMode = config?.scale?.mode || defaultConfig.scale?.mode
      /** 缩放最小比例 */
      let scaleMinRatio: number = config?.scale?.minRatio || defaultConfig.scale?.minRatio

      let rp: Vector2 = this.resetPoint(x, y)
      x = rp.x;
      y = rp.y;


      let picture: Picture = m_pictures[m_picture_op];

      if (this.data.m_op_mode == PictureOpMode.move) {
        picture.x = m_move_start.x + x - moveTouchStart.x;
        picture.y = m_move_start.y + y - moveTouchStart.y;

        if (limitMode == 'picture') {
          if (picture.x < 0) picture.x = 0;
          if (picture.y < 0) picture.y = 0;
          if (picture.x + picture.width > r_width) picture.x = r_width - picture.width;
          if (picture.y + picture.height > r_height) picture.y = r_height - picture.height;
        }
        else if (limitMode == 'point') {
          if (picture.x < m_point_raduis) picture.x = m_point_raduis;
          if (picture.y < m_point_raduis) picture.y = m_point_raduis;
          if (picture.x + m_point_raduis + picture.width > r_width) picture.x = r_width - picture.width - m_point_raduis;
          if (picture.y + m_point_raduis + picture.height > r_height) picture.y = r_height - picture.height - m_point_raduis;
        }
      }
      else if (this.data.m_op_mode == PictureOpMode.scale) {
        let point_op: number = this.data.m_picture_point_op;
        let point: Vector2 = picture.points[point_op]
        let diagonal: Vector2 = this.data.m_move_diagonal


        point.x = m_move_start.x + x - moveTouchStart.x;
        point.y = m_move_start.y + y - moveTouchStart.y;

        rp = this.resetPoint(point.x, point.y);
        point.x = rp.x;
        point.y = rp.y;

        /** 左上 */
        if (point_op == 0) {
          picture.x = point.x;
          picture.width = diagonal.x - picture.x;
          picture.y = point.y;
          picture.height = diagonal.y - picture.y;

          if (scaleMode == 'ratio') {
            if (picture.width < scaleMinRatio * picture.i_width) {
              picture.width = scaleMinRatio * picture.i_width
              picture.x = diagonal.x - picture.width;
            }
            picture.height = picture.width * picture.i_height / picture.i_width;
            picture.y = diagonal.y - picture.height;

            rp = this.resetPoint(picture.x, picture.y);
            picture.y = rp.y;
            picture.height = diagonal.y - picture.y;
            picture.width = picture.height * picture.i_width / picture.i_height;
            picture.x = diagonal.x - picture.width;
          }


          if (picture.width < m_point_raduis * 2) {
            picture.width = m_point_raduis * 2;
            picture.x = diagonal.x - picture.width;
          }
          if (picture.height < m_point_raduis * 2) {
            picture.height = m_point_raduis * 2;
            picture.y = diagonal.y - picture.height
          }
        }
        /** 右上 */
        else if (point_op == 1) {
          picture.x = diagonal.x;
          picture.y = point.y;
          picture.width = point.x - diagonal.x;
          picture.height = diagonal.y - point.y;

          if (scaleMode == "ratio") {
            if (picture.width < scaleMinRatio * picture.i_width) {
              picture.width = scaleMinRatio * picture.i_width
            }
            picture.height = picture.width * picture.i_height / picture.i_width;
            picture.y = diagonal.y - picture.height;

            rp = this.resetPoint(picture.x + picture.width, picture.y);
            picture.y = rp.y;
            picture.height = diagonal.y - picture.y;
            picture.width = picture.height * picture.i_width / picture.i_height;
            picture.x = diagonal.x;
          }


          if (picture.width < m_point_raduis * 2) {
            picture.width = m_point_raduis * 2;
          }
          if (picture.height < m_point_raduis * 2) {
            picture.height = m_point_raduis * 2;
            picture.y = diagonal.y - picture.height
          }
        }
        /** 右下 */
        else if (point_op == 2) {
          picture.x = diagonal.x;
          picture.y = diagonal.y;
          picture.width = point.x - diagonal.x;
          picture.height = point.y - diagonal.y;

          if (scaleMode == "ratio") {
            if (picture.width < scaleMinRatio * picture.i_width) {
              picture.width = scaleMinRatio * picture.i_width
            }
            picture.height = picture.width * picture.i_height / picture.i_width;
            rp = this.resetPoint(picture.x + picture.width, picture.y + picture.height);
            picture.height = rp.y - diagonal.y;
            picture.width = picture.height * picture.i_width / picture.i_height;
          }



          if (picture.width < m_point_raduis * 2) {
            picture.width = m_point_raduis * 2;
          }
          if (picture.height < m_point_raduis * 2) {
            picture.height = m_point_raduis * 2;
          }

        }
        /** 左下 */
        else if (point_op == 3) {
          picture.x = point.x;
          picture.y = diagonal.y;
          picture.width = -point.x + diagonal.x;
          picture.height = point.y - diagonal.y;


          if (scaleMode == "ratio") {
            if (picture.width < scaleMinRatio * picture.i_width) {
              picture.width = scaleMinRatio * picture.i_width
              picture.x = diagonal.x - picture.width;
            }
            picture.height = picture.width * picture.i_height / picture.i_width;

            rp = this.resetPoint(picture.x, picture.y + picture.height);

            picture.height = rp.y - diagonal.y;
            picture.width = picture.height * picture.i_width / picture.i_height;
            picture.x = diagonal.x - picture.width;
          }



          if (picture.width < m_point_raduis * 2) {
            picture.width = m_point_raduis * 2;
            picture.x = diagonal.x - picture.width;
          }
          if (picture.height < m_point_raduis * 2) {
            picture.height = m_point_raduis * 2;
          }

        }

      }

      this.render();
    },
    /**
     * 添加图片
     * @param url 图片地址
     */
    add(url: string) {
      let { config } = this.properties;
      let { m_mixer_canvas, r_width, r_height, m_mixer_context } = this.data

      let m_pictures: Picture[] = this.data.m_pictures;
      let m_add_count: number = config?.add?.count || defaultConfig.add?.count;

      let m_add_scale_width: number = config?.add?.scaleWidth || defaultConfig.add?.scaleWidth;
      let m_add_scale_height: number = config?.add?.scaleHeight || defaultConfig.add?.scaleHeight;

      if (m_pictures.length >= m_add_count) throw { err_code: 1000, err_message: "上传图片数量超出限制" };
      let img = m_mixer_canvas.createImage();
      img.src = url;
      img.onload = () => {
        let { ow, oh } = scaling(img.width, img.height, r_width * m_add_scale_width, r_height * m_add_scale_height)
        let p = new Picture(r_width / 2 - ow / 2, r_height / 2 - oh / 2, ow, oh);
        p.url = url;
        p.img = img;
        m_pictures.push(p);
        this.data.m_picture_op = m_pictures.length - 1;
        this.render();

        this.triggerEvent("change", {
          pictures: m_pictures,
        })

      }
    },
    async save(p?: IPictureMixerSaveParams): Promise<IPictureMixerSaveResult> {
      let config = this.properties.config;

      let { m_result_context, m_result_canvas, r_width, r_height } = this.data

      let type = p?.type || config?.save?.type || defaultConfig?.save?.type;
      let encoderOptions = p?.encoderOptions || config?.save?.encoderOptions || defaultConfig?.save?.encoderOptions;


      let m_pictures: Picture[] = this.data.m_pictures
      let background: string = config?.background || defaultConfig.background;

      m_result_context.clearRect(0, 0, r_width, r_height)
      m_result_context.fillStyle = background;
      m_result_context.fillRect(0, 0, r_width, r_height)

      // 按顺序加载图片内容
      for (let i = 0; i < m_pictures.length; i++) {
        const picture = m_pictures[i];
        m_result_context.drawImage(picture.img, picture.x, picture.y, picture.width, picture.height);
      }

      return new Promise(async (resolve, reject) => {
        try {
          let base64 = m_result_canvas.toDataURL(type, encoderOptions);
          m_result_context.clearRect(0, 0, r_width, r_height)
          let tempFilePath = await base64ToTempFilePath(base64)
          resolve({
            base64,
            tempFilePath,
            width: r_width,
            height: r_height
          })
        } catch (error) {
          reject(error)
        }
      })

    },
    resetPoint(x, y) {
      /** 极限模式 */
      let limitMode: keyof IPictureMixerConfigMoveLimitMode = this.data.m_move_limit_mode;
      /** 点的半径 */
      let pointRaduis: number = this.data.m_point_raduis;
      /** 真实的宽度 */
      let r_width: number = this.data.r_width;
      let r_height: number = this.data.r_height;
      /** 当为图片时 */
      if (limitMode == 'picture') {
        if (x < 0) x = 0
        if (y < 0) y = 0
        if (x > r_width) x = r_width;
        if (y > r_height) y = r_height;
      }
      /** 当为点时 */
      else if (limitMode == 'point') {
        if (x < pointRaduis) x = pointRaduis
        if (y < pointRaduis) y = pointRaduis
        if (x > r_width - pointRaduis) x = r_width - pointRaduis;
        if (y > r_height - pointRaduis) y = r_height - pointRaduis;
      }
      return Vector2.c(x, y)
    }
  }
})
