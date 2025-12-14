<?php
$page_title = "Swap and Sum";
include "partials/header.php";
?>

<main class="card">
    <div class="card-header">
        <h2 class="card-title">Number Calculator</h2>
        <p class="card-subtitle">Enter two numbers to calculate their sum</p>
    </div>
    <form action="./result.php" method="POST">
        <div>
            <label class="input-label" for="first-number"> First Number </label>
            <input
                class="input-field"
                type="number"
                name="first-number"
                id="first-number"
                value="first-number"
                placeholder="Enter first value"
                required
            />
        </div>
        <div>
            <label class="input-label" for="second-number">
                Second Number
            </label>
            <input
                class="input-field"
                type="number"
                id="second-number"
                name="second-number"
                value="second-number"
                placeholder="Enter second value"
                required
            />
        </div>
        <button type="submit" class="button">Calculate</button>
    </form>
</main>
<?php include "partials/footer.php"; ?>
