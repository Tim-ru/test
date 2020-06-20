class Math3D {
    constructor() {
        this.matrix = {
            zoom: [[1, 0, 0, 0],
                   [0, 1, 0, 0],
                   [0, 0, 1, 0],
                   [0, 0, 0, 1]],

            move: [[1, 0, 0, 0],
                   [0, 1, 0, 0],
                   [0, 0, 1, 0],
                   [1, 1, 1, 1]],

            rotateOx: [[1, 0, 0, 0],
                       [0, 1, 1, 0],
                       [0, -1, 1, 0],
                       [0, 0, 0, 1]],

            rotateOy: [[1, 0, -1, 0],
                       [0, 1, 0, 0],
                       [1, 0, 1, 0],
                       [0, 0, 0, 1]],

            rotateOz: [[1, 1, 0, 0],
                       [-1, 1, 0, 0],
                       [0, 0, 1, 0],
                       [0, 0, 0, 1]]

            
        };
    }
    multMatrix(T, m) {
        const c = [0, 0, 0, 0];
        const rows = T.length;
        const colomns = m.length;
        for (let i = 0; i < rows; i++) {
            let S = 0;
            for (let j = 0; j < colomns; j++) {
                S += T[j][i] * m[j];
            }
            c[i] = S;
        }
        return c;
    }

    

    zoomMatrix(delta) {
        this.matrix.zoom = [[delta, 0, 0,  0],
                            [0, delta, 0,  0],
                            [0,  0, delta, 0],
                            [0,  0,    0,  1]];
    }

    moveMatrix(sx, sy, sz) {
        this.matrix.move = [[1, 0, 0, 0],
                            [0, 1, 0, 0],
                            [0, 0, 1, 0],
                            [sx, sy, sz, 1]];
    }

    rotateOxMatrix(alpha) {
        this.matrix.rotateOx = [[1, 0, 0, 0],
                                [0, Math.cos(alpha), Math.sin(alpha), 0],
                                [0, -Math.sin(alpha), Math.cos(alpha), 0],
                                [0, 0, 0, 1]]
    }

    rotateOyMatrix(alpha) {
        this.matrix.rotateOy = [[Math.cos(alpha), 0, -Math.sin(alpha), 0],
                                [0, 1, 0, 0],
                                [Math.sin(alpha), 0, Math.cos(alpha), 0],
                                [0, 0, 0, 1]]
    }

    rotateOzMatrix(alpha) {
        this.matrix.rotateOz = [[Math.cos(alpha), Math.sin(alpha), 0, 0],
                                [-Math.sin(alpha), Math.cos(alpha), 0, 0],
                                [0, 0, 1, 0],
                                [0, 0, 0, 1]]
    }

    transform(point, matrix) {
        const array = this.multMatrix(matrix, [point.x, point.y, point.z, 1]);
        point.x = array[0];
        point.y = array[1];
        point.z = array[2];
    }
    // масштабирование
    zoom(point) {
        this.transform(point, this.matrix.zoom);
    }
    // смещение
    move(point) {
        this.transform(point, this.matrix.move);
    }
    // повороты
    rotateOx(point) {
        this.transform(point, this.matrix.rotateOx);
    }
    rotateOy(point) {
        this.transform(point, this.matrix.rotateOy);
    }
    rotateOz(point) {
        this.transform(point, this.matrix.rotateOz);
    }
}