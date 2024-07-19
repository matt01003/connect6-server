class Connect6 {
  constructor() {
    this.board = [...Array(19)].map(() => Array(19).fill("."))
    this.currentPlayer = "x"
    this.round = 0
    this.winner = null
    this.gameOver = false
    this.gameTree = []
  }

  makeMove(move) {
    const { coordinate, chess } = move
    const { row, col } = coordinate
    this.board[row][col] = chess
    this.gameTree.push(move)

    if (this.round === 0 || this.round % 2 === 0)
      this.currentPlayer = this.currentPlayer === "o" ? "x" : "o"
    this.round = this.round++

    if (this.checkGameover(chess)) {
      this.currentPlayer = null
      this.gameOver = true
      this.winner = chess
    }

    return {
      currentPlayer: this.currentPlayer,
      round: this.round,
      move: move,
      winner: this.winner,
      gameOver: this.gameOver,
    }
  }

  checkGameover(chess) {
    const size = this.board.length

    for (let i = 0; i < size; i++) {
      for (let j = 0; j <= size - 6; j++) {
        if (
          this.board[i][j] === chess &&
          this.board[i][j + 1] === chess &&
          this.board[i][j + 2] === chess &&
          this.board[i][j + 3] === chess &&
          this.board[i][j + 4] === chess &&
          this.board[i][j + 5] === chess
        ) {
          return true
        }
      }
    }

    for (let i = 0; i <= size - 6; i++) {
      for (let j = 0; j < size; j++) {
        if (
          this.board[i][j] === chess &&
          this.board[i + 1][j] === chess &&
          this.board[i + 2][j] === chess &&
          this.board[i + 3][j] === chess &&
          this.board[i + 4][j] === chess &&
          this.board[i + 5][j] === chess
        ) {
          return true
        }
      }
    }

    for (let i = 0; i <= size - 6; i++) {
      for (let j = 0; j <= size - 6; j++) {
        if (
          this.board[i][j] === chess &&
          this.board[i + 1][j + 1] === chess &&
          this.board[i + 2][j + 2] === chess &&
          this.board[i + 3][j + 3] === chess &&
          this.board[i + 4][j + 4] === chess &&
          this.board[i + 5][j + 5] === chess
        ) {
          return true
        }
      }
    }

    for (let i = 0; i <= size - 6; i++) {
      for (let j = 5; j < size; j++) {
        if (
          this.board[i][j] === chess &&
          this.board[i + 1][j - 1] === chess &&
          this.board[i + 2][j - 2] === chess &&
          this.board[i + 3][j - 3] === chess &&
          this.board[i + 4][j - 4] === chess &&
          this.board[i + 5][j - 5] === chess
        ) {
          return true
        }
      }
    }
    return false
  }

  toJson() {
    return {
      board: this.board,
      currentPlayer: this.currentPlayer,
      round: this.round,
      winner: this.winner,
      gameOver: this.gameOver,
      gameTree: this.gameTree,
    }
  }
}

module.exports = Connect6
