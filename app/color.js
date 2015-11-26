const Color = {

    distance(color1, color2) {
        return Math.sqrt(Math.pow(color1[0] - color2[0], 2) +
                         Math.pow(color1[1] - color2[1], 2) +
                         Math.pow(color1[2] - color2[2], 2));
    },

    rgbToYuv(rgbColor) {
        const r = rgbColor[0],
              g = rgbColor[1],
              b = rgbColor[2],
              y = 0.299 * r + 0.587 * g + 0.114 * b,
              u = 0.492 * (b - y),
              v = 0.877 * (r - y);

        return [y, u, v];
    },

    yuvToRgb(yuvColor) {
        const y = yuvColor[0],
              u = yuvColor[1],
              v = yuvColor[2],
              r = y + 1.14 * v,
              g = y - 0.395 * u - 0.581 * v,
              b = y + 2.033 * u;

        return [r, g, b];
    },

    randomYuvColor() {
        return Color.rgbToYuv([
            Math.random() * 255 | 0,
            Math.random() * 255 | 0,
            Math.random() * 255 | 0
        ]);
    },

    MAX_YUV_DISTANCE: 255
};


export {Color};
