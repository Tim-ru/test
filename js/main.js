window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

window.onload = function () {
    const WINDOW = {
        LEFT: -10,
        BOTTOM: -10,
        WIDTH: 20,
        HEIGHT: 20,
        CENTER: new Point(0, 0, -30), // центр окошка, через которое видим мир
        CAMERA: new Point(0, 0, -50) // точка, из которой смотрим на мир
    };
    const ZOOM_OUT = 1.1;
    const ZOOM_IN = 0.9;
    let canMove = false;
    let canPrint = {
        point: false,
        edges: false,
        polygons: true
    };


    const sur = new Surfaces;
    const canvas = new Canvas({ width: 800, height: 800, WINDOW, callbacks: { wheel, mousemove, mouseup, mousedown, move } });
    const graph3D = new Graph3D({ WINDOW });
    const ui = new UI({ callbacks: { move, printPoints, printEdges, printPolygons } });

    // сцена
    const SCENE = [
       sur.singlehyperboloid()
    ];
    //ичточник света
    const LIGHT = new Light(-20, 0, -12, 200);


    // about callbacks
    function wheel(event) {
        const delta = (event.wheelDelta > 0) ? ZOOM_OUT : ZOOM_IN;
        graph3D.zoomMatrix(delta);
        SCENE.forEach(subject => {
            subject.points.forEach(point => graph3D.zoom(point));
            if (subject.animation) {
                for (let key in subject.animation) {
                    graph3D.zoom(subject.animation[key]);
                }
            }
        });
    }

    function mouseup() {
        canMove = false;
    }

    function mouseleave() {
        mouseup();
    }

    function mousedown() {
        canMove = true;
    }

    function mousemove(event) {
        if (canMove) {
            if (event.movementX) { // крутить вокруг OY
                const alpha = canvas.sx(event.movementX) / WINDOW.CAMERA.z * 4;
                graph3D.rotateOyMatrix(alpha);
                SCENE.forEach(subject => {
                    subject.points.forEach(point => graph3D.rotateOy(point));
                    if (subject.animation) {
                        for (let key in subject.animation) {
                            graph3D.rotateOy(subject.animation[key]);
                        }
                    }
                });
            }
            if (event.movementY) { // крутить вокруг OX
                const alpha = canvas.sy(event.movementY) / WINDOW.CAMERA.z * 4;
                graph3D.rotateOxMatrix(alpha);
                SCENE.forEach(subject => {
                    subject.points.forEach(point => graph3D.rotateOx(point));
                    if (subject.animation) {
                        for (let key in subject.animation) {
                            graph3D.rotateOx(subject.animation[key]);
                        }
                    }
                });
            }
        }
    }

    function printPoints(value) {
        canPrint.points = value;
    }

    function printEdges(value) {
        canPrint.edges = value;
    }

    function printPolygons(value) {
        canPrint.polygons = value;
    }

    function offPolygons() {
        flag = true;
    }

    function move(direction) {
        if (direction === 'up' || direction === 'down') {
            const delta = (direction === 'up') ? 0.1 : -0.1;
            graph3D.moveMatrix(0, delta, 0);
            SCENE.forEach(subject => subject.points.forEach(point => graph3D.move(point)));
        }
        if (direction === 'left' || direction === 'right') {
            const delta = (direction === 'right') ? 0.1 : -0.1;
            graph3D.moveMatrix(delta, 0, 0);
            SCENE.forEach(subject => subject.points.forEach(point => graph3D.move(point)));
        }
    }

    // about render

    function printAllPolygons() {
        if (canPrint.polygons) {

            const polygons = [];

            SCENE.forEach(subject => {
                graph3D.calcDistance(subject, WINDOW.CAMERA, 'distance');
                graph3D.calcDistance(subject, LIGHT, 'lumen');
                for (let i = 0; i < subject.polygons.length; i++) {
                    if (subject.polygons[i].visible) {
                        const polygon = subject.polygons[i];
                        const point1 = {
                            x: graph3D.xs(subject.points[polygon.points[0]]),
                            y: graph3D.ys(subject.points[polygon.points[0]])
                        };
                        const point2 = {
                            x: graph3D.xs(subject.points[polygon.points[1]]),
                            y: graph3D.ys(subject.points[polygon.points[1]])
                        };
                        const point3 = {
                            x: graph3D.xs(subject.points[polygon.points[2]]),
                            y: graph3D.ys(subject.points[polygon.points[2]])
                        };
                        const point4 = {
                            x: graph3D.xs(subject.points[polygon.points[3]]),
                            y: graph3D.ys(subject.points[polygon.points[3]])
                        };

                        let { r, g, b } = polygon.color;
                        const lumen = graph3D.calcIllumination(polygon.lumen, LIGHT.lumen);
                        r = Math.round(r * lumen);
                        g = Math.round(g * lumen);
                        b = Math.round(b * lumen);
                        polygons.push({
                            points: [point1, point2, point3, point4],
                            color: polygon.rgbToHex(r, g, b),
                            distance: polygon.distance
                        });
                    }
                }
            });
            // отрисовка всех полигонов
            polygons.sort((a, b) => b.distance - a.distance);
            polygons.forEach(polygon => canvas.polygon(polygon.points, polygon.color));
        }
    }

    function printSubject(subject) {

        // print edges
        if (canPrint.edges) {
            for (let i = 0; i < subject.edges.length; i++) {
                const edges = subject.edges[i];
                const point1 = subject.points[edges.p1];
                const point2 = subject.points[edges.p2];
                canvas.line(graph3D.xs(point1), graph3D.ys(point1), graph3D.xs(point2), graph3D.ys(point2));
            }
        }

        // print points
        if (canPrint.points) {
            for (let i = 0; i < subject.points.length; i++) {
                const points = subject.points[i];
                canvas.point(graph3D.xs(points), graph3D.ys(points));
            }
        }

    }

    function render() {
        canvas.clear();
        printAllPolygons();
        SCENE.forEach(subject => printSubject(subject));
        canvas.text(WINDOW.LEFT, WINDOW.HEIGHT / 2 - 1, 'FPS:' + FPSout);
    }

    function animation() {
        // Вращение фигуры
        SCENE.forEach(subject => {
            if (subject.animation) {
                for (let key in subject.animation) {
                    const { x, y, z } = subject.animation[key];
                    const xn = WINDOW.CENTER.x - x;
                    const yn = WINDOW.CENTER.y - y;
                    const zn = WINDOW.CENTER.z - z;
                    // переместить объект в центр координат
                    graph3D.moveMatrix(xn, yn, zn);
                    subject.points.forEach(point => graph3D.move(point));
                    // повращать объект
                    const yearLength = (subject.yearLength === null) ? 1 : subject.yearLength;
                    const alpha = (2 * Math.PI) / yearLength;
                    graph3D[`${key}Matrix`](alpha);
                    subject.points.forEach(point => graph3D[key](point));
                    // переместить центр объекта после вращения обратно 
                    graph3D.moveMatrix(-xn, -yn, -zn);
                    subject.points.forEach(point => graph3D.move(point));
                }
            }
        });
    }

    setInterval(animation, 10);

    let FPS = 0;
    let FPSout = 0;
    let timestamp = (new Date()).getTime();
    (function animLoop() {

        //Считаем FPS
        FPS++;
        const currentTimestamp = (new Date()).getTime();
        if (currentTimestamp - timestamp >= 1000) {
            timestamp = currentTimestamp;
            FPSout = FPS;
            FPS = 0;
        }

        //Рисуем сцену
        render();
        requestAnimationFrame(animLoop);
    })();
};

