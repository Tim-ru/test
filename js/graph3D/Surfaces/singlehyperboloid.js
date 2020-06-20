Surfaces.prototype.singlehyperboloid = (point = new Point(0,0,0), size1 = 4, size2 = 2, h = 7, color1 = "#133799", color2 = "#880055", count = 20) => {
    function circlexy(point, size, angley = 10, count = 20) {
        for (let i = 0; i < count; i++) {
            points.push(new Point(
                point.x + size * Math.sin(Math.PI * 2 * (i / count)) * Math.sin(angley / 180 * Math.PI),
                point.y + size * Math.sin(Math.PI * 2 * (i / count)) * Math.cos(angley / 180 * Math.PI),
                point.z + size * Math.cos(Math.PI * 2 * (i / count)), 
                2
            ));
        }
    }

    const points = [], edges = [], polygons = [];

    //точки
    for(let i = 0; i < size1; i++) {
        circlexy(new Point(point.x, point.y + h, point.z), i, 90, count);
    }

    for(let i = h; i >= -h; i--){
        circlexy(new Point(point.x, point.y + i, point.z), size1 - (size1 - size2) * Math.cos(Math.abs(i / h * Math.PI / 2)), 90, count);
    }

    for(let i = 0; i < size1; i++) {
        circlexy(new Point(point.x, point.y - h, point.z), i, 90, count);
    }

    //рёбра

    for(let i = 0; i < h * 2 + size1 * 2; i++){
        for(let j = 0; j < count; j++){
            edges.push(new Edge(count * i + j, count * (i + 1) + j));
        }
    }
    
    for(let i = 0; i < points.length - 1; i++){
        if((i + 1) % count !== 0){
            edges.push(new Edge(i, i + 1));
        } else {
            edges.push(new Edge(i, i - count + 1));
        }
        if(i === points.length - 2){
            edges.push(new Edge(points.length - 1, points.length - count));
        }
    }
    
    //полигоны
    for(i = 0; i < h * 2 + size1 * 2; i++){
        for(j = 0; j < count; j++) {
            if ((j + 1) % count !== 0) {
                polygons.push(new Polygon([count * i + j + 1, count * i + j,  count * (i + 1) + j + 1, count * (i + 1) + j], color1));
                polygons.push(new Polygon([count * i + j, count * (i + 1) + j + 1,  count * i + j + 1,count * (i + 1) + j], color2));
            } else  {
                polygons.push(new Polygon([ count * (i + 1) - 1, count * i, count * (i + 2) - 1, count * (i + 1)], color1));
                polygons.push(new Polygon([count * i,  count * (i + 2) - 1, count * (i + 1) - 1, count * (i + 1)], color2));
            }
            
        }
    }

    return new Subject(points, edges, polygons);
}