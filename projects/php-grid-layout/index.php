<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>PHP Grid Layout</title>
        <style>
            *,
            *::before,
            *::after {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                background-color: lightcoral;
                width: 100%;
                height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .box {
                background-color: cornflowerblue;
                width: 120px;
                height: 120px;
                border-radius: 7px;
                margin: 10px 12px;
                display: inline-flex;
                color: ghostwhite;
                font-weight: 600;
                font-size: 26px;
                justify-content: center;
                align-items: center;
                font-family: "monospace";
                transition: background-color 120ms linear;
            }

            .box:hover {
                background-color: lightblue;
            }
        </style>
    </head>
    <body>
        <div class="box-container">
            <?php
            $count = 0;
            for ($i = 1; $i <= 4; $i++) {
                for ($j = 1; $j <= 4; $j++) {
                    $count += 1;
                    echo "<div class='box'>" . $count . "</div>";
                }
                echo "<br />";
            }
            ?>
        </div>
    </body>
</html>
