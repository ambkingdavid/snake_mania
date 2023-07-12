$(document).ready(function () {
  const canvas = $("#gameCanvas")[0];
  const context = canvas.getContext("2d");
  const scoreElement = $("#score");

  const gridSize = 20;
  const gridWidth = canvas.width / gridSize;
  const gridHeight = canvas.height / gridSize;
  let snake;
  let food;
  let score;
  let isPaused = true; // Variable to track the game's pause state
  let direction = "right"; // Declare the 'direction' variable here

  function createSnake() {
    const snakeLength = 3;
    snake = [];
    for (let i = snakeLength - 1; i >= 0; i--) {
      snake.push({ x: i, y: 5 });
    }
  }

  function createFood() {
    let isOnSnake = true;
    let newFood;
    while (isOnSnake) {
      //creates food
      newFood = {
        x: Math.floor(Math.random() * gridWidth),
        y: Math.floor(Math.random() * gridHeight)
      };

      isOnSnake = false;
      // prevent food from spawning on snakes body
      for (let i = 0; i < snake.length; i++) {
        if (snake[i].x === newFood.x && snake[i].y === newFood.y) {
          isOnSnake = true;
          break;
        }
      }
    }

    food = newFood;
  }

  function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
      const snakePart = snake[i];
      const isHead = i === 0;
      drawSnakePart(snakePart, isHead);
    }

    drawFood(food);


    const snakeHead = snake[0];

    // Check for collision with the snake's body
    for (let i = 1; i < snake.length; i++) {
      if (snake[i].x === snakeHead.x && snake[i].y === snakeHead.y) {
        // Collision detected, reset the game
        resetGame();
        return; // Exit the draw function to stop the game loop
      }
    }

    // check for collision with food
    if (snakeHead.x === food.x && snakeHead.y === food.y) {
      score++;
      createFood();
    } else {
      snake.pop();
    }



    let newHead = { x: snakeHead.x, y: snakeHead.y };
    if (direction === "left") {
      newHead.x = (newHead.x - 1 + gridWidth) % gridWidth; // Wrap around horizontally
    } else if (direction === "up") {
      newHead.y = (newHead.y - 1 + gridHeight) % gridHeight; // Wrap around vertically
    } else if (direction === "right") {
      newHead.x = (newHead.x + 1) % gridWidth; // Wrap around horizontally
    } else if (direction === "down") {
      newHead.y = (newHead.y + 1) % gridHeight; // Wrap around vertically
    }

    snake.unshift(newHead);

    scoreElement.text("Score: " + score);


  }




  function drawSnakePart(snakePart, isHead) {
    if (isHead) {
      // Draw snake's head with a different color
      context.fillStyle = "#FFD700"; // Color of the snake's head
    } else {
      // Draw snake's body as a circular shape
      context.fillStyle = "#023020"; // Color of the snake's body
    }

    context.beginPath();
    context.arc(
      snakePart.x * gridSize + gridSize / 2, // center x-coordinate
      snakePart.y * gridSize + gridSize / 2, // center y-coordinate
      gridSize / 2, // radius
      0, // start angle (in radians)
      2 * Math.PI // end angle (in radians)
    );
    context.fill();
    context.strokeStyle = "#000";
    context.stroke();
  }




  function drawFood(food) {
    context.fillStyle = "#FFFFFF";
    context.fillRect(
      food.x * gridSize,
      food.y * gridSize,
      gridSize,
      gridSize
    );
    context.strokeStyle = "#000";
    context.strokeRect(
      food.x * gridSize,
      food.y * gridSize,
      gridSize,
      gridSize
    );
  }

  function resetGame() {
    clearInterval(intervalId);
    snake = [];
    direction = "right";
    createSnake();
    createFood();
    score = 0;
    intervalId = setInterval(gameLoop, 250);
  }

  function gameLoop() {
    if (!isPaused) {
      draw();
      // Adjust the speed based on the score
      if (score <= 5) {
        clearInterval(intervalId);
        intervalId = setInterval(gameLoop, 200);
      } else if (score >= 10 && score < 15) {
        clearInterval(intervalId);
        intervalId = setInterval(gameLoop, 150);
      } else if (score >= 15 && score < 20) {
        clearInterval(intervalId);
        intervalId = setInterval(gameLoop, 100);
      } else if (score >= 20) {
        clearInterval(intervalId);
        intervalId = setInterval(gameLoop, 50);
      }
    }
  }

  function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
      clearInterval(intervalId);
    } else {
      intervalId = setInterval(gameLoop, 250);
    }
  }

  createSnake();
  createFood();
  score = 0;
  let intervalId = setInterval(gameLoop, 250);


  $(document).keydown(function (event) {
    const keyPressed = event.which;
    if (keyPressed === 37 && direction !== "right") direction = "left";
    else if (keyPressed === 38 && direction !== "down") direction = "up";
    else if (keyPressed === 39 && direction !== "left") direction = "right";
    else if (keyPressed === 40 && direction !== "up") direction = "down";
    else if (keyPressed === 32) isPaused = !isPaused; // Toggle pause state when spacebar is pressed
  });


  $(canvas).click(function (event) {
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;
    console.log("mouseX: ", mouseX);
    console.log("mouseY: ", mouseY);

    const snakeHead = snake[0];
    console.log("snakeHead: ", snakeHead);

    const deltaX = mouseX - snakeHead.x * gridSize;
    const deltaY = mouseY - snakeHead.y * gridSize;
    console.log("deltaX: ", deltaX);
    console.log("deltaY: ", deltaY);

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0 && direction !== "right") direction = "left";
      else if (deltaX > 0 && direction !== "left") direction = "right";
    } else {
      if (deltaY < 0 && direction !== "down") direction = "up";
      else if (deltaY > 0 && direction !== "up") direction = "down";
    }
  });

  // Button click event handlers
  $("#upButton").click(function () {
    if (direction !== "down") direction = "up";
  });

  $("#leftButton").click(function () {
    if (direction !== "right") direction = "left";
  });

  $("#rightButton").click(function () {
    if (direction !== "left") direction = "right";
  });

  $("#downButton").click(function () {
    if (direction !== "up") direction = "down";
  });

  $("#pauseButton").click(function () {
    togglePause();
  });
});