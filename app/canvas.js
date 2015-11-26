import {Color} from './color';

const proto = {

    init() {
        this.domCanvas = document.createElement('canvas');
        this.domCanvas.width = this.width;
        this.domCanvas.height = this.height;
        this.ctx = this.domCanvas.getContext('2d');
    },

    setImage(image) {
        this.ctx.drawImage(image, 0, 0);
    },

    addTo(domContainer) {
        domContainer.appendChild(this.domCanvas);
    },

    getYuvImage() {
        const imageData = this.ctx.getImageData(0, 0, this.width, this.height).data,
              yuvData = [];

        for (let i = 0; i < imageData.length; i += 4) {
            const color = [imageData[i], imageData[i+1], imageData[i+2]];
            yuvData.push(Color.rgbToYuv(color));
        }

        return yuvData;
    },

    setYuvImage(yuvImage) {
        const imageData = this.ctx.createImageData(this.width, this.height),
              data = imageData.data;

        for (let i = 0; i < yuvImage.length; i++) {
            const dataIndex = i*4,
                  color = Color.yuvToRgb(yuvImage[i]);
            data[dataIndex] = color[0];
            data[dataIndex+1] = color[1];
            data[dataIndex+2] = color[2];
            data[dataIndex+3] = 255; // alpha
        }

        this.ctx.putImageData(imageData, 0, 0);
    }
};

const Canvas = {
    create(width, height) {
        const canvas = Object.create(proto);
        canvas.width = width;
        canvas.height = height;
        canvas.init();

        return canvas;
    }
}


export {Canvas};
