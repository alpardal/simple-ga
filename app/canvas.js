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

    getImageData() {
        return this.ctx.getImageData(0, 0, this.width, this.height);
    },

    createImageData() {
        return this.ctx.createImageData(this.width, this.height);
    },

    setImageData(imageData) {
        this.ctx.putImageData(imageData, 0, 0);
    }
};

const Canvas = {
    create(width, height) {
        var canvas = Object.create(proto);
        canvas.width = width;
        canvas.height = height;
        canvas.init();

        return canvas;
    },

    createRandom(width, height) {
        var canvas = Canvas.create(width, height);

        var img = canvas.createImageData(),
            data = img.data;

        for (var i = 0; (i+3) < data.length; i += 4) {
            data[i] = Math.random() * 255; // r
            data[i+1] = Math.random() * 255; // g
            data[i+2] = Math.random() * 255; // b
            data[i+3] = 255; // a
        }

        canvas.setImageData(img);

        return canvas;
    }
}


export {Canvas};
