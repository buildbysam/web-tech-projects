<?php

$barCount = isset($_POST["barCount"]) ? intval($_POST["barCount"]) : 30;
$action = $_POST["action"] ?? "";
$bars = [];
$steps = [];
$currentStep = intval($_POST["currentStep"] ?? 0);
$finished = false;

if ($action === "start") {
    for ($i = 0; $i < $barCount; $i++) {
        $bars[] = rand(20, 300);
    }

    $temp = $bars;
    for ($i = 0; $i < count($temp); $i++) {
        for ($j = 0; $j < count($temp) - $i - 1; $j++) {
            if ($temp[$j] > $temp[$j + 1]) {
                $swap = $temp[$j];
                $temp[$j] = $temp[$j + 1];
                $temp[$j + 1] = $swap;
            }
            $steps[] = $temp;
        }
    }
    $currentStep = 0;
} elseif ($action === "next") {
    $bars = json_decode($_POST["bars"], true);
    $steps = json_decode($_POST["steps"], true);
    if ($currentStep < count($steps) - 1) {
        $currentStep++;
    }
} elseif ($action === "prev") {
    $bars = json_decode($_POST["bars"], true);
    $steps = json_decode($_POST["steps"], true);
    if ($currentStep > 0) {
        $currentStep--;
    }
} elseif ($action === "finish") {
    $bars = json_decode($_POST["bars"], true);
    $steps = json_decode($_POST["steps"], true);
    $finished = true;
    $currentStep = count($steps) - 1;
}

$displayBars = $steps[$currentStep] ?? $bars;
$finished = $finished || $currentStep >= count($steps) - 1;
?>

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="stylesheet" href="./css/style.css">
	<title>PHP Bubble Sort</title>
</head>
<body>
    <div class="container">
    <!-- Slider card -->
    <div class="card">
        <form method="POST">

            <div class="slider-header">
                <label>List Size</label>
                <div class="slider-value"><?= $barCount ?></div>
            </div>

            <input type="range" min="5" max="60" name="barCount" value="<?= $barCount ?>">

            <input type="hidden" name="bars" value='<?= json_encode($bars) ?>'>
            <input type="hidden" name="steps" value='<?= json_encode(
                $steps,
            ) ?>'>
            <input type="hidden" name="currentStep" value="<?= $currentStep ?>">

            <div class="controls">
                <button name="action" value="start">Start</button>
                <button name="action" value="prev" <?= $currentStep <= 0
                    ? "disabled"
                    : "" ?>>Previous</button>
                <button name="action" value="next" <?= empty($steps) ||
                $finished
                    ? "disabled"
                    : "" ?>>Next</button>
                <button class="red" name="action" value="finish" <?= empty(
                    $steps
                ) || $finished
                    ? "disabled"
                    : "" ?>>
                    <?= $finished ? "Finished" : "Finish" ?>
                    </button>
            </div>

        </form>
    </div>

    <!-- Visualization card -->
    <div class="card">
        <h3>
            <?php if ($finished): ?>
            Total Steps: <?= count($steps) - 1 ?>
            <?php else: ?>
            Step: <?= $currentStep ?>
            <?php endif; ?>
        </h3>

        <div class="bars">
            <?php foreach ($displayBars as $h): ?>
                <div class="bar" style="height: <?= $h ?>px;"></div>
            <?php endforeach; ?>
        </div>
    </div>
    </div>
    <script src="./js/script.js"></script>
</body>
</html>
