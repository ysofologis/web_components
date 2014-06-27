var itemArray = [
        { title: "Marvelous Mint", text: "Gelato", picture: "images/fruits/60Mint.png" },
        { title: "Succulent Strawberry", text: "Sorbet", picture: "images/fruits/60Strawberry.png" },
        { title: "Banana Blast", text: "Low-fat frozen yogurt", picture: "images/fruits/60Banana.png" },
        { title: "Lavish Lemon Ice", text: "Sorbet", picture: "images/fruits/60Lemon.png" },
        { title: "Creamy Orange", text: "Sorbet", picture: "images/fruits/60Orange.png" },
        { title: "Very Vanilla", text: "Ice Cream", picture: "images/fruits/60Vanilla.png" },
        { title: "Banana Blast", text: "Low-fat frozen yogurt", picture: "images/fruits/60Banana.png" },
        { title: "Lavish Lemon Ice", text: "Sorbet", picture: "images/fruits/60Lemon.png" }
];

var items = [];

function Pusher() {
    this.iteration = 1;
    this.index = 0;
    
    this.getNextIndex = function() {
        this.index ++;
        return this.index + this.iteration;
    };
    
    this.getNextIteration = function() {
        this.iteration ++;
    };
}

var itemPusher = new Pusher();
// Generate 160 items
for (var i = 0; i < 20; i++) {
    itemArray.forEach(function (item) {
        var newItem = {};
        
        newItem.title = item.title;
        newItem.picture = item.picture;
        newItem.text = item.text;
        newItem.index = itemPusher.getNextIndex();
        items.push(newItem);
    });
    itemPusher.getNextIteration();
}


WinJS.Namespace.define("Sample.ListView", {
    data: new WinJS.Binding.List(items)
});
WinJS.UI.processAll();

