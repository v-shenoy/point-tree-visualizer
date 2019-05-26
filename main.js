let tree;

function setup()
{
    createCanvas(500, 500);
    background(0);
    let boundary = new Bound2D(250, 250, 250, 250);
    tree = new QuadTree(boundary, 0);
    for(let i = 0; i < 10; i++)
    {
        tree.insert(new Point2D(random(width), random(height)));
    }
}

function draw()
{
    tree.show();
}