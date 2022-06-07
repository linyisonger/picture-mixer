/**
 * 缩放
 * @param ow 源图宽 
 * @param oh 源图高
 * @param tw 目标宽
 * @param th 目标高
 */
export function scaling(ow: number, oh: number, tw: number, th: number) {
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
export function base64ToTempFilePath(base64: string): Promise<string> {
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
export function timestamp() {
    return new Date().getTime();
}
/** 获取图片 */
export function createImage(canvas: any, src: string): Promise<CanvasImageSource> {
    return new Promise((resolve, reject) => {
        let img = canvas.createImage();
        img.src = src;
        img.onload = () => {
            resolve(img)
        }
    })

}


/**
 * 裁切图片clip方法参数
 */
export interface ICutPictureClipParams {
    /** 图片地址 */
    src: string,
    x: number
    y: number
    width: number
    height: number
}

/**
 * 旋转图片rotate方法参数
 */
export interface IRotatePictureRotateParams {
    /** 图片地址 */
    src: string,
    /** 
     * 旋转角度
     * 仅支持 90° 180° 270° 360°
     */
    angle: number
    /** 图片源 */
    image: CanvasImageSource
}

/**
 * 旋转图片rotate方法返回值
 */
export interface IRotatePictureRotateRes {
    base64: string,
    tempFilePath: string,
    width: number,
    height: number
}
