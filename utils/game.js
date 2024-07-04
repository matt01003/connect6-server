const checkGameover = (board, chess) => {
  const size = board.length

  for (let i = 0; i < size; i++) {
    for (let j = 0; j <= size - 6; j++) {
      if (
        board[i][j] === chess &&
        board[i][j + 1] === chess &&
        board[i][j + 2] === chess &&
        board[i][j + 3] === chess &&
        board[i][j + 4] === chess &&
        board[i][j + 5] === chess
      ) {
        return true
      }
    }
  }

  for (let i = 0; i <= size - 6; i++) {
    for (let j = 0; j < size; j++) {
      if (
        board[i][j] === chess &&
        board[i + 1][j] === chess &&
        board[i + 2][j] === chess &&
        board[i + 3][j] === chess &&
        board[i + 4][j] === chess &&
        board[i + 5][j] === chess
      ) {
        return true
      }
    }
  }

  for (let i = 0; i <= size - 6; i++) {
    for (let j = 0; j <= size - 6; j++) {
      if (
        board[i][j] === chess &&
        board[i + 1][j + 1] === chess &&
        board[i + 2][j + 2] === chess &&
        board[i + 3][j + 3] === chess &&
        board[i + 4][j + 4] === chess &&
        board[i + 5][j + 5] === chess
      ) {
        return true
      }
    }
  }

  for (let i = 0; i <= size - 6; i++) {
    for (let j = 5; j < size; j++) {
      if (
        board[i][j] === chess &&
        board[i + 1][j - 1] === chess &&
        board[i + 2][j - 2] === chess &&
        board[i + 3][j - 3] === chess &&
        board[i + 4][j - 4] === chess &&
        board[i + 5][j - 5] === chess
      ) {
        return true
      }
    }
  }
  return false
}

const updateGameState = (game, move) => {
  const { coordinate, chess } = move
  const [row, col] = coordinate
  let { round, currentPlayer } = game
  game.board[row][col] = chess

  if (round === 0 || round % 2 === 0)
    game.currentPlayer = currentPlayer === "o" ? "x" : "o"
  game.round++

  return game
}

module.exports = { checkGameover, updateGameState }
