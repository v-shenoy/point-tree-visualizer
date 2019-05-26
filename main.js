let tree;
let drawGrid = true;

function setup()
{
    createCanvas(600, 600);
    tree = new QuadTree(new Bound2D(width/2, height/2, width, height), 0);
    for(let i=0;i<100;i++)
    {
        tree.insert(new Point2D(random(width), random(height)));
    }
}

function draw()
{
    clear();
    background(0);
    tree.show();
}

let balance = document.querySelector("#balance");
balance.addEventListener("click", () => {
    tree.balance();
});