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
        else if(node.dir == direction.SW)
        {
            node = node.parent.nw;
        }
        else
        {
            node = node.parent.ne;
        }
        while(node.hasDivided && path.length > 0)
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
        let neighbours = {
            north: this.findNorthNeighbour(),
            east: this.findEastNeighbour(),
            south: this.findSouthNeighbour(),
            west: this.findWestNeighbour()
        };    
        return neighbours;
    }

    balanceNorth(node)
    {
        if(this.depth < node.depth - 1)
        {
            this.divide();
            node.findNorthNeighbour().balanceNorth(node);
            return true;
        }
        return false;
    }

    balanceEast(node)
    {
        if(this.depth < node.depth - 1)
        {
            this.divide();
            node.findEastNeighbour().balanceEast(node);
            return true;
        }
        return false;
    }

    balanceSouth(node)
    {
        if(this.depth < node.depth - 1)
        {
            this.divide();
            node.findSouthNeighbour().balanceSouth(node);
            return true;
        }
        return false;
    }

    balanceWest(node)
    {
        if(this.depth < node.depth - 1)
        {
            this.divide();
            node.findWestNeighbour().balanceWest(node);
            return true;
        }
        return false;
    }

    zeroBalance()
    {
        let ans = false;
        if(this.hasDivided)
        {
            ans = this.nw.zeroBalance() || ans;
            ans = this.ne.zeroBalance() || ans;
            ans = this.sw.zeroBalance() || ans;
            ans = this.se.zeroBalance() || ans;
        }
        else
        {
            let neighbours = this.findNeighbours();
            if(neighbours.north != null)
            {
                ans = neighbours.north.balanceNorth(this) || ans;
            }
            if(neighbours.east != null)
            {
                ans = neighbours.east.balanceEast(this) || ans;
            }
            if(neighbours.south != null)
            {
                ans = neighbours.south.balanceSouth(this) || ans;
            }
            if(neighbours.west != null)
            {
                ans = neighbours.west.balanceWest(this) || ans;
            }
        }
        return ans;
    }

    oneBalance()
    {
        let ans = false;
        if(this.hasDivided)
        {
            ans = this.nw.oneBalance() || ans;
            ans = this.ne.oneBalance() || ans;
            ans = this.sw.oneBalance() || ans;
            ans = this.se.oneBalance() || ans;
        }
        else
        {
            let north = this.findNorthNeighbour();
            if(north != null)
            {
                let ne = north.findEastNeighbour();
                if(ne != null && ne.depth < this.depth - 1)
                {
                    ne.divide();
                    ans = true;
                }
                let nw = north.findWestNeighbour();
                if(nw != null && nw.depth < this.depth - 1)
                {
                    nw.divide();
                    ans = true;
                }
            }
            let south = this.findSouthNeighbour();
            if(south != null)
            {
                let se = south.findEastNeighbour();
                if(se != null && se.depth < this.depth - 1)
                {
                    se.divide();
                    ans = true;
                }
                let sw = south.findWestNeighbour();
                if(sw != null && sw.depth < this.depth - 1)
                {
                    sw.divide();
                    ans = true;
                }
            }
        }
        return ans;
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