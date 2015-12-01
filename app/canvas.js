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
            yuvData.push(imageData[i]);
        }

        return yuvData;
    },

    setYuvImage(yuvImage) {
        const imageData = this.ctx.createImageData(this.width, this.height),
              data = imageData.data;

        yuvImage.forEach(function(c, i){
            const dataIndex = i*4;

            data[dataIndex] = c;
            data[dataIndex+1] = c;
            data[dataIndex+2] = c;
            data[dataIndex+3] = 255; // alpha
        });

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
