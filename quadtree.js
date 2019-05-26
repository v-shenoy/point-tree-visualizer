class QuadTree
{
    constructor(bounds, height)
    {
        this.bounds = bounds;
        this.point = null;
        this.hasDivided = false;
        this.height = height;
    }

    contains(point)
    {
        return this.bounds.contains(point);
    }

    divide()
    {
        let bounds = this.bounds;
        let nwBounds = new Bound2D(bounds.x - bounds.l/2, bounds.y - bounds.b/2, bounds.l/2, bounds.b/2);
        this.nw = new QuadTree(nwBounds, this.height + 1);
        let neBounds = new Bound2D(bounds.x + bounds.l/2, bounds.y - bounds.b/2, bounds.l/2, bounds.b/2);
        this.ne = new QuadTree(neBounds, this.height + 1);
        let swBounds = new Bound2D(bounds.x - bounds.l/2, bounds.y + bounds.b/2, bounds.l/2, bounds.b/2);
        this.sw = new QuadTree(swBounds, this.height + 1);
        let seBounds = new Bound2D(bounds.x + bounds.l/2, bounds.y + bounds.b/2, bounds.l/2, bounds.b/2);
        this.se = new QuadTree(seBounds, this.height + 1);
        this.hasDivided = true;
    }

    insert(point)
    {
        if(this.hasDivided)
        {
            if(this.nw.contains(point))
            {
                this.nw.insert(point);
            }
            else if(this.ne.contains(point))
            {
                this.ne.insert(point);
            }
            else if(this.sw.contains(point))
            {
                this.sw.insert(point);
            }
            else if(this.se.contains(point))
            {
                this.se.insert(point);
            }
        }
        else
        {
            if(this.point == null)
            {
                this.point = point;
            }
            else
            {
                let originalPoint = this.point;
                this.point = null;
                this.divide();
                this.insert(originalPoint);
                this.insert(point);
            }
        }
    }

    show()
    {
        stroke(255);
        strokeWeight(1);
        noFill();
        rectMode(CENTER);
        rect(this.bounds.x, this.bounds.y, 2 * this.bounds.l, 2 * this.bounds.b);
        if(this.hasDivided)
        {
            this.nw.show();
            this.ne.show();
            this.sw.show();
            this.se.show();
        }
        else
        {
            if(this.point != null)
            {
                stroke(0, 255, 0);
                strokeWeight(3);
                point(this.point.x, this.point.y);
            }
            else
            {
                stroke(255, 0, 0);
                strokeWeight(3);
                point(this.bounds.x, this.bounds.y);
            }
        }
    }
}