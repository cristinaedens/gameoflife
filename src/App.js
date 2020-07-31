import React, { useState, useCallback, useRef } from "react";
import produce from "immer";
import './App.css';

const numRows = 28;
const numColumns = 50;

//checks neighbor cells across the grid
const neighborOps = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

const emptyGrid = () => {
  const rows = [];
  // creates the grid
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numColumns), () => 0));
  }
  return rows;
};

function App() {
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [grid, setGrid] = useState(() => {
    return emptyGrid();
  });


//gives current value for the running state while being mutable
const runningRef = useRef(running);
runningRef.current = running;

const runGame = useCallback(() => {
  //not running, end the function.
  if (!runningRef.current) {
    return;
  }
  //uses recursive to update the state

  setGrid((g) => {
    //current grid is set as g
    return produce(g, (gridCopy) => {
      for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numColumns; j++) {
          //Figure out how many neighbors each cell has
          let neighbors = 0;
          neighborOps.forEach(([x, y]) => {
            const newI = i + x;
            const newJ = j + y;
            //Bounds of your grid to make sure it doesnt go above or below
            if (
              newI >= 0 &&
              newI < numRows &&
              newJ >= 0 &&
              newJ < numColumns
            ) {
              neighbors += g[newI][newJ];
            }
          });
          //If current cell is dead, but has 3 neighbors it comes alive
          if (neighbors < 2 || neighbors > 3) {
            gridCopy[i][j] = 0;
          } else if (g[i][j] === 0 && neighbors === 3) {
            gridCopy[i][j] = 1;
          }
        }
      }
    });
  });

  setTimeout(runGame, speed);
}, []);

return (
  <div class="page-container">
    <h1>Conway's Game Of Life</h1>

    <div className="description-container">
    <div class="description">
        <div>
          <h2>Description</h2>
          <div className="paragraph">
            <p>✫Any live cell with two or three live neighbours survives.</p>
            <p>
            ✫Any dead cell with three live neighbours becomes a live cell.
            </p>
            <p>
            ✫All other live cells die in the next generation. Similarly, all
              other dead cells stay dead.
            </p>
          </div>
        </div>
      </div>
      <div class="description">
        <div>
          <h2>Instructions</h2>
          <div className="paragraph">
            <p>✫Click on any cell to make it "alive".</p>
            <p>✫Click play to see how your simulation plays out!</p>
            <p>
              ✫Change the speed, and even create a random simulation using the
              buttons.
            </p>
          </div>
        </div>
      </div>
</div>

  <div className="grid-container">
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${numColumns}, 20px`,
      }}
    >
      {/* This creates the grid by mapping over rows. 
        i is the index of rows, c is the index of columns  */}
      {grid.map((rows, i) =>
        rows.map((col, c) => (
          <div
            key={`${i}-${c}`}
            //This sets the index of the clicked grid to 'alive'
            onClick={() => {
              const newGrid = produce(grid, (gridCopy) => {
                gridCopy[i][c] = grid[i][c] ? 0 : 1;
              });
              setGrid(newGrid);
            }}
            style={{
              width: 20,
              height: 20,
              backgroundColor: grid[i][c] ? "#b7deed" : "#4F4E54",
              border: "solid 1px #E8D6A8",
            }}
          />
        ))
      )}
    </div>
    </div>
    <div class="button-container">
        {/*changes the state to determine whether the game is running or not*/}
        <button
          onClick={() => {
            setRunning(!running);
            if (!running) {
              runningRef.current = true;
              runGame();
            }
          }}
        >
          {running ? <i class="pause" /> : <i class="play" />}
          ►/{'\u2016'}
        </button>

        {/*slow down the game*/}
        <button
          onClick={() => {
            if (speed <= 5000) {
              setSpeed(speed + 100);
            }
          }}
        >
          <i class="speed-down" />
          -
        </button>

          {/*speed up the game*/}
        <button
          onClick={() => {
            if (speed >= 100) {
              setSpeed(speed - 100);
            }
          }}
        >
          <i class="speed-up" />
          +
        </button>

        {/*Clear the grid*/}
        <button
          onClick={() => {
            setGrid(emptyGrid());
          }}
        >
          <i class="clear" />
          Clear
        </button>

        {}
        <button
          onClick={() => {
            const rows = [];
            for (let i = 0; i < numRows; i++) {
              rows.push(
                Array.from(Array(numColumns), () =>
                  Math.random() > 0.8 ? 1 : 0
                )
              );
            }

            setGrid(rows);
          }}
        >
          <i class="Random" />
          Random
        </button>
      </div>
  </div>
);
}


export default App;
