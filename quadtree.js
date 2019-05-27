let displayGrid = false;
const toggleGrid = document.querySelector("#toggle-grid");

toggleGrid.addEventListener("click", () => {
    displayGrid = !displayGrid;
    drawTree();
});

const direction = {
    NW : 1,
    NE : 2,
    SW : 3,
    SE : 4
}

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
        this.nw = new QuadTree(nwBounds, this.depth + 1, this, direction.NW);
        let neBounds = new Bound2D(bounds.x + bounds.l/2, bounds.y - bounds.b/2, bounds.l/2, bounds.b/2);
        this.ne = new QuadTree(neBounds, this.depth + 1, this, direction.NE);
        let swBounds = new Bound2D(bounds.x - bounds.l/2, bounds.y + bounds.b/2, bounds.l/2, bounds.b/2);
        this.sw = new QuadTree(swBounds, this.depth + 1, this, direction.SW);
        let seBounds = new Bound2D(bounds.x + bounds.l/2, bounds.y + bounds.b/2, bounds.l/2, bounds.b/2);
        this.se = new QuadTree(seBounds, this.depth + 1, this, direction.SE);
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
        while(node.parent != null && node.dir != direction.SW && node.dir != direction.SE)
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
            if(dir == direction.NW)
            {
                node = node.sw;
            }
            else if(dir == direction.NE)
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
        while(node.parent != null && node.dir != direction.NW && node.dir != direction.SW)
        {
            path.push(node.dir);
            node = node.parent;
        }
        if(node.parent == null)
        {
            return null;
        }
        else if(node.dir == direction.NW)
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
            if(dir == direction.NE)
            {
                node = node.nw;
            }
            else if(dir == direction.SE)
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
        while(node.parent != null && node.dir != direction.NW && node.dir != direction.NE)
        {
            path.push(node.dir);
            node = node.parent;
        }
        if(node.parent == null)
        {
            return null;
        }
        else if(node.dir == direction.NW)
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
            if(dir == direction.SW)
            {
                node = node.nw;
            }
            else if(dir == direction.SE)
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
        while(node.parent != null && node.dir != direction.NE && node.dir != direction.SE)
        {
            path.push(node.dir);
            node = node.parent;
        }
        if(node.parent == null)
        {
            return null;
        }
        else if(node.dir == direction.NE)
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
            if(dir == direction.NW)
            {
                node = node.ne;
            }
            else if(dir == direction.SW)
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