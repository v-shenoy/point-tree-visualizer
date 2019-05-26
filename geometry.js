class Point2D
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }
}

class Bound2D
{
    constructor(x, y, l, b)
    {
        this.x = x;
        this.y = y;
        this.l = l;
        this.b = b;
    }

    contains(point)
    {
        let x = point.x;
        let y = point.y; 
        return (x >= this.x - this.l && 
            x <= this.x + this.l &&
            y >= this.y - this.b &&
            y <= this.y + this.b);
    }
}