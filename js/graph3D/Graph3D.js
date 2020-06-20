class Graph3D {
    constructor({ WINDOW }) {
        this.WINDOW = WINDOW;
        this.math = new Math3D();
    }

    xs(point) {
        const zs = this.WINDOW.CENTER.z;
        const z0 = this.WINDOW.CAMERA.z;
        const x0 = this.WINDOW.CAMERA.x;
        return (point.x - x0) / (point.z - z0) * (zs - z0) + x0;
    }

    ys(point) {
        const zs = this.WINDOW.CENTER.z;
        const z0 = this.WINDOW.CAMERA.z;
        const y0 = this.WINDOW.CAMERA.y;
        return (point.y - y0) / (point.z - z0) * (zs - z0) + y0;
    }
    zoomMatrix(delta) {
        this.math.zoomMatrix(delta);
    }
    moveMatrix(sx, sy, sz) {
        this.math.moveMatrix(sx, sy, sz);
    }
    rotateOxMatrix(alpha) {
        this.math.rotateOxMatrix(alpha);
    }
    rotateOyMatrix(alpha) {
        this.math.rotateOyMatrix(alpha);
    }
    rotateOzMatrix(alpha) {
        this.math.rotateOzMatrix(alpha);
    }

    // масштабирование точки
    zoom(point) {
        this.math.zoom(point);
    }
    //перенос куда-нибудь
    move(point) {
        this.math.move(point);
    }
    // повороты по осям
    rotateOx(point) {
        this.math.rotateOx(point);
    }
    rotateOy(point) {
        this.math.rotateOy(point);
    }
    rotateOz(point) {
        this.math.rotateOz(point);
    }

    //посчитать расстояние от полигонов до чего-нибудь
    calcDistance(subject, endPoint, name) {
        for (let i = 0; i < subject.polygons.length; i++) {
            if (subject.polygons[i].visible) {
                const points = subject.polygons[i].points;
                let x = 0, y = 0, z = 0;
                for (let j = 0; j < points.length; j++) {
                    x += subject.points[points[j]].x;
                    y += subject.points[points[j]].y;
                    z += subject.points[points[j]].z;
                }
                x = x / points.length;
                y = y / points.length;
                z = z / points.length;
                subject.polygons[i][name] =
                    Math.sqrt((endPoint.x - x) * (endPoint.x - x) +
                        (endPoint.y - y) * (endPoint.y - y) +
                        (endPoint.z - z) * (endPoint.z - z));
            }
        }
    }

    calcIllumination(distance, lumen) {
        let illumination = (distance) ? lumen / (distance * distance) : 1;
        return (illumination > 1) ? 1 : illumination;
    }
}