let tree;
let drawGrid = true;

function setup()
{
    createCanvas(600, 600);
    tree = new QuadTree(new Bound2D(width/2, height/2, width/2, height/2), 0);
}

function draw()
{
    clear();
    background(0);
    if(mouseIsPressed)
    {
        tree.insert(new Point2D(mouseX, mouseY));
    }
    tree.show();
}

let balance = document.querySelector("#balance");
balance.addEventListener("click", () => {
    tree.balance();
});