let displayGrid = true;
let toggleGrid = document.querySelector("#toggle-grid");

toggleGrid.addEventListener("click", () => {
    displayGrid = !displayGrid;
});

class QuadTree
{
    constructor(bounds, depth, parent = null, dir = -1)
    {
        this.bounds = bounds;
        this.point = null;
        this.hasDivided = false;
        this.depth = depth;
        this.parent = parent;
        this.dir = dir;
    }

    contains(point)
    {
        return this.bounds.contains(point);
    }

    divide()
    {
        let bounds = this.bounds;
        let nwBounds = new Bound2D(bounds.x - bounds.l/2, bounds.y - bounds.b/2, bounds.l/2, bounds.b/2);
        this.nw = new QuadTree(nwBounds, this.depth + 1, this, 1);
        let neBounds = new Bound2D(bounds.x + bounds.l/2, bounds.y - bounds.b/2, bounds.l/2, bounds.b/2);
        this.ne = new QuadTree(neBounds, this.depth + 1, this, 2);
        let swBounds = new Bound2D(bounds.x - bounds.l/2, bounds.y + bounds.b/2, bounds.l/2, bounds.b/2);
        this.sw = new QuadTree(swBounds, this.depth + 1, this, 3);
        let seBounds = new Bound2D(bounds.x + bounds.l/2, bounds.y + bounds.b/2, bounds.l/2, bounds.b/2);
        this.se = new QuadTree(seBounds, this.depth + 1, this, 4);
        this.hasDivided = true;
        let point = this.point;
        this.point = null;
        this.insert(point);
    }

    insert(point)
    {
        if(point == null)
        {
            return;
        }
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
                if(this.point.x == point.x && this.point.y == point.y)
                {
                    return;
                }
                this.divide();
                this.insert(point);
            }
        }
    }

    divideUntil(depth)
    {
        if(this.depth >= depth)
        {
            return;
        }
        else
        {
            this.divide();
            this.nw.divideUntil(depth);
            this.ne.divideUntil(depth);
            this.sw.divideUntil(depth);
            this.se.divideUntil(depth);
        }
    }

    findNorthNeighbour()
    {
        let path = []
        let node = this;
        while(node.parent != null && node.dir != 3 && node.dir != 4)
        {
            path.push(node.dir);
            node = node.parent;
        }
        if(node.parent == null)
        {
            return null;
        }
        else if(node.dir == 3)
        {
            node = node.parent.nw;
        }
        else
        {
            node = node.parent.ne;
        }
        while(node.hasDivided == true && path.length > 0)
        {
            let dir = path.pop();
            if(dir == 1)
            {
                node = node.sw;
            }
            else if(dir == 2)
            {
                node = node.se;
            }
        }
        if(node.hasDivided)
        {
            return null;
        }
        else
        {
            return node;
        }
    }

    findEastNeighbour()
    {
        let path = []
        let node = this;
        while(node.parent != null && node.dir != 1 && node.dir != 3)
        {
            path.push(node.dir);
            node = node.parent;
        }
        if(node.parent == null)
        {
            return null;
        }
        else if(node.dir == 1)
        {
            node = node.parent.ne;
        }
        else
        {
            node = node.parent.se;
        }
        while(node.hasDivided == true && path.length > 0)
        {
            let dir = path.pop();
            if(dir == 2)
            {
                node = node.nw;
            }
            else if(dir == 4)
            {
                node = node.sw;
            }
        }
        if(node.hasDivided)
        {
            return null;
        }
        else
        {
            return node;
        }
    }

    findSouthNeighbour()
    {
        let path = []
        let node = this;
        while(node.parent != null && node.dir != 1 && node.dir != 2)
        {
            path.push(node.dir);
            node = node.parent;
        }
        if(node.parent == null)
        {
            return null;
        }
        else if(node.dir == 1)
        {
            node = node.parent.sw;
        }
        else
        {
            node = node.parent.se;
        }
        while(node.hasDivided == true && path.length > 0)
        {
            let dir = path.pop();
            if(dir == 3)
            {
                node = node.nw;
            }
            else if(dir == 4)
            {
                node = node.ne;
            }
        }
        if(node.hasDivided)
        {
            return null;
        }
        else
        {
            return node;
        }
    }

    findWestNeighbour()
    {
        let path = []
        let node = this;
        while(node.parent != null && node.dir != 2 && node.dir != 4)
        {
            path.push(node.dir);
            node = node.parent;
        }
        if(node.parent == null)
        {
            return null;
        }
        else if(node.dir == 2)
        {
            node = node.parent.nw;
        }
        else
        {
            node = node.parent.sw;
        }
        while(node.hasDivided == true && path.length > 0)
        {
            let dir = path.pop();
            if(dir == 1)
            {
                node = node.ne;
            }
            else if(dir == 3)
            {
                node = node.se;
            }
        }
        if(node.hasDivided)
        {
            return null;
        }
        else
        {
            return node;
        }
    }

    findNeighbours()
    {
        let neighbours = [];
        neighbours.push(this.findNorthNeighbour());
        neighbours.push(this.findEastNeighbour());
        neighbours.push(this.findSouthNeighbour());
        neighbours.push(this.findWestNeighbour());
        return neighbours;
    }

    balance()
    {
        if(this.hasDivided)
        {
            this.nw.balance();
            this.ne.balance();
            this.sw.balance();
            this.se.balance();
        }
        else
        {
            let neighbours = this.findNeighbours();
            for(let neighbour of neighbours)
            {
                if(neighbour != null)
                {
                    neighbour.divideUntil(this.depth - 1);
                }
            }
        }
    }

    show()
    {
        if(displayGrid)
        {
            stroke(255);
            strokeWeight(1);
            noFill();
            rectMode(CENTER);
            rect(this.bounds.x, this.bounds.y, 2 * this.bounds.l, 2 * this.bounds.b);
        }
        if(this.hasDivided)
        {
            this.nw.show();
            this.ne.show();
            this.sw.show();
            this.se.show();
        }
        else
        {
            console.log(this.bounds.x);
            if(this.point != null)
            {
                stroke(0, 255, 0);
                strokeWeight(2);
                point(this.point.x, this.point.y);
            }
            else
            {
                stroke(255, 0, 0);
                strokeWeight(2);
                point(this.bounds.x, this.bounds.y);
            }
        }
    }
}