<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" type="text/css" href="stylesheet.css">
    <title>Game of FIGHT!!</title>
</head>
<body>
    <div id="container">
        <div id="grid">
            {%- for i in range(20) %}
            <!-- Row {{ i }} -->
                {%- for j in range(20) %}
                <div class="cell" row="{{ i }}" column="{{ j }}"></div>
                {%- endfor %}
            {%- endfor %}
        </div>
        <div id="buttons">
            <button id="play_button">Play</button>
            <button id="step_button">Step</button>
            <button id="stop_button">Stop</button>
            <button id="clear_button">Clear</button>
        </div>
        <input id="slider" type="range" min="0" max="4" step="1" value="2"><label id="slider_value" for="slider">Speed: 250ms</label>
    </div>

    <script type="module">
        import { init } from "./game_of_fight.js";
        init();
    </script>
</body>
</html>