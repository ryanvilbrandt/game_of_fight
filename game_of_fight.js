let grid;
let grid_width, grid_height;
let play_timer;
const PLAY_TIMEOUT = 500;

export function init() {
    console.log("Hello game!");

    build_grid();

    // Prevent right-click on parent grid element
    document.querySelector("#grid").addEventListener("contextmenu", function(event) { event.preventDefault() });

    document.querySelector("#play_button").addEventListener("click", play);
    document.querySelector("#step_button").addEventListener("click", step);
    document.querySelector("#stop_button").addEventListener("click", stop);
    document.querySelector("#clear_button").addEventListener("click", clear);
}

function build_grid() {
    grid = [];
    let cells = document.querySelectorAll(".cell");
    cells.forEach(cell => {
        let row = parseInt(cell.attributes["row"].value);
        let col = parseInt(cell.attributes["column"].value);
        if (col === 0)
            grid.push([]);
        grid[row].push(cell);
        // Add event listeners to cell
        cell.addEventListener("mouseenter", on_enter);
        cell.addEventListener("mousedown", on_mouse_down);
        cell.addEventListener("contextmenu", function(event) {
            event.preventDefault();
            // on_mouse_down(event);
        });
    });
    grid_height = grid.length;
    grid_width = grid_height > 0 ? grid[0].length : 0;
}

function on_enter(event) {
    if (event.buttons > 0) {
        let my_team = event.buttons === 1 ? "red" : "blue";
        toggle_team(event.target, my_team);
    }
}

function on_mouse_down(event) {
    let cell = event.target;
    let row = cell.attributes["row"].value;
    let col = cell.attributes["column"].value;
    console.log(`Clicked! ${ row } ${ col } ${ event.button }`);

    let my_team = event.button === 0 ? "red" : "blue";
    toggle_team(cell, my_team);
}

function toggle_team(cell, my_team) {
    let other_team = my_team === "red" ? "blue" : "red";

    if (cell.classList.contains(my_team)) {
        cell.classList.remove(my_team);
    } else {
        cell.classList.remove(other_team);
        cell.classList.add(my_team);
    }
}

function set_team(cell, team) {
    if (team === "white") {
        cell.classList.remove("red");
        cell.classList.remove("blue");
    } else
        cell.classList.add(team);
}

function play(event) {
    console.log("Start!");
    clearTimeout(play_timer);
    play_timer = setTimeout(() => { step(event, true); }, PLAY_TIMEOUT);
}


function step(event, autoplay = false) {
    console.log("Step!");
    let new_values = [];
    for (let row=0; row < grid.length; row++) {
        new_values.push([]);
        for (let col=0; col < grid[0].length; col++) {
            let color = get_color(row, col);
            let neighbor_counts = get_neighbor_count(row, col);
            new_values[row][col] = get_new_color(color, neighbor_counts);
        }
    }
    for (let row=0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
            set_team(grid[row][col], new_values[row][col]);
        }
    }
    if (autoplay)
        play_timer = setTimeout((event) => { step(event, true); }, PLAY_TIMEOUT);
}

function get_neighbor_count(row, col) {
    let neighbors_colors = get_neighbor_colors(row, col);
    let neighbor_counts = {"white": 0, "red": 0, "blue": 0};
    neighbors_colors.forEach((color) => {
        neighbor_counts[color]++;
    })
    return neighbor_counts;
}

function get_neighbor_colors(row, col) {
    let neighbors = []
    neighbors.push(get_color(row - 1, col - 1));
    neighbors.push(get_color(row - 0, col - 1));
    neighbors.push(get_color(row + 1, col - 1));
    neighbors.push(get_color(row - 1, col - 0));
    neighbors.push(get_color(row + 1, col - 0));
    neighbors.push(get_color(row - 1, col + 1));
    neighbors.push(get_color(row - 0, col + 1));
    neighbors.push(get_color(row + 1, col + 1));
    return neighbors;
}

function get_color(row, col) {
    row = wrap_value(row, grid_height);
    col = wrap_value(col, grid_width);
    let cell = grid[row][col];
    if (cell.classList.contains("red"))
        return "red"
    if (cell.classList.contains("blue"))
        return "blue"
    return "white"
}

function wrap_value(val, max_val) {
    if (val < 0)
        return max_val - 1;
    if (val > max_val - 1)
        return 0;
    return val;
}

function get_new_color(color, neighbor_counts) {
    let non_whites = neighbor_counts["red"] + neighbor_counts["blue"];
    if (color === "white") {
        if (non_whites === 3)
            return "red"
    } else {
        if (non_whites < 2 || non_whites > 3)
            return "white";
    }
    return color;
}

function stop(event) {
    console.log("Stop!");
    clearTimeout(play_timer);
}

function clear(event) {
    console.log("Clear!");
    document.querySelectorAll(".cell").forEach((cell) => { set_team(cell, "white") });
}