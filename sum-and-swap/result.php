<?php
$page_title = "Result";
include "partials/header.php";

function redirect()
{
    header("HTTP/1.1 302 Found");
    header("Location: /");
    exit();
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST["first-number"]) && isset($_POST["second-number"])) {
        $first_number = htmlspecialchars($_POST["first-number"]);
        $second_number = htmlspecialchars($_POST["second-number"]);
        $is_first_int = filter_var($first_number, FILTER_VALIDATE_INT);
        $is_second_int = filter_var($second_number, FILTER_VALIDATE_INT);

        if ($is_first_int && $is_second_int) {
            $original_first = $first_number;
            $original_second = $second_number;
            $a = $original_first;
            $b = $original_second;

            $a = $a + $b;
            $b = $a - $b;
            $a = $a - $b;

            $original_result = $original_first + $original_second;
            $swap_result = $a + $b;
        } else {
            $error_message =
                "Validation Error: One or both inputs were not valid whole numbers.";
            include "error.php";
            exit();
        }
    } else {
        redirect();
    }
} else {
    redirect();
}
?>

<main class="card card-result">
    <div class="card-header">
        <h2 class="card-title">Calculation Result</h2>
    </div>
    <div class="result result-original">
        <p class="result-title">Result (Original Order)</p>
        <p class="result-value"><?= $original_result ?></p>
    </div>
    <div class="parameter">
        <p class="parameter-title">First Number</p>
        <p class="parameter-value"><?= $first_number ?></p>
    </div>
    <div class="parameter">
        <p class="parameter-title">Second Number</p>
        <p class="parameter-value"><?= $second_number ?></p>
    </div>
    <hr class="divider" />
    <div class="swap-header">
        <img src="./img/swap-icon.svg" alt="swap icon" class="swap-icon" />
        <p class="swap-title">Swapped Input Order</p>
    </div>
    <div class="parameter parameter-swap">
        <p class="parameter-title">First Number -> Second Number</p>
        <p class="parameter-value"><?= $a ?></p>
    </div>
    <div class="parameter parameter-swap">
        <p class="parameter-title">Second Number -> First Number</p>
        <p class="parameter-value"><?= $b ?></p>
    </div>
    <div class="result">
        <p class="result-title">Result After Swapping</p>
        <p class="result-value"><?= $swap_result ?></p>
    </div>
    <a href="/">
        <button type="button" class="button">Recalculate</button>
    </a>
</main>

<?php include "partials/footer.php"; ?>
