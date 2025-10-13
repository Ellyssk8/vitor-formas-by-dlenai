import React, { useState, useEffect, useCallback } from "react";
import { GeometricShape } from "./ShapeCard";
import ShapeVisual from "./ShapeVisual";
import VitorCharacter from "./VitorCharacter";
import { cn } from "@/lib/utils";
import proximoDesafioBtn from "@/assets/buttons/proximo-desafio.png";

interface MatchThreeGameProps {
  shapes: GeometricShape[];
  onCorrectAnswer: () => void;
  onErrorAnswer: () => void;
  onNext: () => void;
  className?: string;
  level?: number;
}

interface GridCell {
  shape: GeometricShape;
  row: number;
  col: number;
  id: string;
  isMatched: boolean;
  isFalling: boolean;
}

const MatchThreeGame: React.FC<MatchThreeGameProps> = ({
  shapes,
  onCorrectAnswer,
  onNext,
  className,
  level = 1,
}) => {
  const [grid, setGrid] = useState<GridCell[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(20);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("Combine 3 ou mais formas iguais!");
  const [gameOver, setGameOver] = useState(false);
  const [targetScore, setTargetScore] = useState(100);

  const gridSize = 8;

  // Ajusta dificuldade baseado no nível
  const getGameConfig = useCallback(() => {
    if (level <= 3) {
      return { 
        moves: 25, 
        targetScore: 100, 
        availableShapes: shapes.slice(0, 4) // 4 formas básicas
      };
    } else if (level <= 6) {
      return { 
        moves: 20, 
        targetScore: 200, 
        availableShapes: shapes.slice(0, 6) // 6 formas
      };
    } else {
      return { 
        moves: 15, 
        targetScore: 300, 
        availableShapes: shapes // todas as formas
      };
    }
  }, [level, shapes]);

  // Gera uma forma aleatória
  const getRandomShape = useCallback((availableShapes: GeometricShape[]): GeometricShape => {
    return availableShapes[Math.floor(Math.random() * availableShapes.length)];
  }, []);

  // Verifica se criaria um match na posição
  const wouldCreateMatch = useCallback((
    currentGrid: GridCell[][],
    row: number,
    col: number,
    shape: GeometricShape
  ): boolean => {
    // Verifica horizontal
    let horizontalCount = 1;
    if (col >= 1 && currentGrid[row][col - 1]?.shape.id === shape.id) horizontalCount++;
    if (col >= 2 && currentGrid[row][col - 2]?.shape.id === shape.id) horizontalCount++;
    
    // Verifica vertical
    let verticalCount = 1;
    if (row >= 1 && currentGrid[row - 1]?.[col]?.shape.id === shape.id) verticalCount++;
    if (row >= 2 && currentGrid[row - 2]?.[col]?.shape.id === shape.id) verticalCount++;
    
    return horizontalCount >= 3 || verticalCount >= 3;
  }, []);

  // Inicializa o grid
  const initializeGrid = useCallback(() => {
    const config = getGameConfig();
    const newGrid: GridCell[][] = [];
    
    for (let row = 0; row < gridSize; row++) {
      newGrid[row] = [];
      for (let col = 0; col < gridSize; col++) {
        let shape: GeometricShape;
        let attempts = 0;
        
        // Evita criar matches na inicialização
        do {
          shape = getRandomShape(config.availableShapes);
          attempts++;
        } while (attempts < 10 && wouldCreateMatch(newGrid, row, col, shape));
        
        newGrid[row][col] = {
          shape,
          row,
          col,
          id: `${row}-${col}-${Date.now()}`,
          isMatched: false,
          isFalling: false,
        };
      }
    }
    
    setGrid(newGrid);
    setMoves(config.moves);
    setTargetScore(config.targetScore);
    setScore(0);
    setGameOver(false);
    setMessage("Combine 3 ou mais formas iguais!");
  }, [getGameConfig, getRandomShape, wouldCreateMatch]);


  // Encontra todos os matches no grid
  const findMatches = useCallback((currentGrid: GridCell[][]): Set<string> => {
    const matches = new Set<string>();
    
    // Verifica matches horizontais
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize - 2; col++) {
        const shape1 = currentGrid[row][col].shape.id;
        const shape2 = currentGrid[row][col + 1].shape.id;
        const shape3 = currentGrid[row][col + 2].shape.id;
        
        if (shape1 === shape2 && shape2 === shape3) {
          matches.add(`${row}-${col}`);
          matches.add(`${row}-${col + 1}`);
          matches.add(`${row}-${col + 2}`);
          
          // Verifica se há mais matches consecutivos
          let extraCol = col + 3;
          while (extraCol < gridSize && currentGrid[row][extraCol].shape.id === shape1) {
            matches.add(`${row}-${extraCol}`);
            extraCol++;
          }
        }
      }
    }
    
    // Verifica matches verticais
    for (let col = 0; col < gridSize; col++) {
      for (let row = 0; row < gridSize - 2; row++) {
        const shape1 = currentGrid[row][col].shape.id;
        const shape2 = currentGrid[row + 1][col].shape.id;
        const shape3 = currentGrid[row + 2][col].shape.id;
        
        if (shape1 === shape2 && shape2 === shape3) {
          matches.add(`${row}-${col}`);
          matches.add(`${row + 1}-${col}`);
          matches.add(`${row + 2}-${col}`);
          
          // Verifica se há mais matches consecutivos
          let extraRow = row + 3;
          while (extraRow < gridSize && currentGrid[extraRow][col].shape.id === shape1) {
            matches.add(`${extraRow}-${col}`);
            extraRow++;
          }
        }
      }
    }
    
    return matches;
  }, []);

  // Remove matches e preenche espaços vazios
  const processMatches = useCallback(async () => {
    setIsProcessing(true);
    
    let currentGrid = [...grid.map(row => [...row])];
    let matchesFound = findMatches(currentGrid);
    
    if (matchesFound.size === 0) {
      setIsProcessing(false);
      return;
    }
    
    // Marca células como matched
    matchesFound.forEach(key => {
      const [row, col] = key.split('-').map(Number);
      currentGrid[row][col].isMatched = true;
    });
    setGrid(currentGrid);
    
    // Adiciona pontos
    const points = matchesFound.size * 10;
    setScore(prev => prev + points);
    if (points > 30) {
      setMessage("Incrível! Match grande!");
      onCorrectAnswer();
    }
    
    // Aguarda animação
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Faz as peças caírem
    const config = getGameConfig();
    for (let col = 0; col < gridSize; col++) {
      let emptySpaces = 0;
      
      for (let row = gridSize - 1; row >= 0; row--) {
        if (currentGrid[row][col].isMatched) {
          emptySpaces++;
        } else if (emptySpaces > 0) {
          currentGrid[row + emptySpaces][col] = {
            ...currentGrid[row][col],
            row: row + emptySpaces,
            isFalling: true,
          };
          currentGrid[row][col] = {
            shape: getRandomShape(config.availableShapes),
            row,
            col,
            id: `${row}-${col}-${Date.now()}`,
            isMatched: false,
            isFalling: true,
          };
        }
      }
      
      // Preenche espaços vazios do topo
      for (let row = 0; row < emptySpaces; row++) {
        currentGrid[row][col] = {
          shape: getRandomShape(config.availableShapes),
          row,
          col,
          id: `${row}-${col}-${Date.now()}`,
          isMatched: false,
          isFalling: true,
        };
      }
    }
    
    setGrid(currentGrid);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Remove flag de falling
    currentGrid = currentGrid.map(row => 
      row.map(cell => ({ ...cell, isFalling: false }))
    );
    setGrid(currentGrid);
  }, [grid, findMatches, getRandomShape, getGameConfig, onCorrectAnswer]);

  // Verifica se há novos matches recursivamente
  useEffect(() => {
    if (isProcessing) return;
    const matches = findMatches(grid);
    if (matches.size > 0 && grid.length > 0) {
      processMatches();
    }
  }, [grid, isProcessing, findMatches, processMatches]);

  // Troca duas células
  const swapCells = useCallback(async (
    row1: number, 
    col1: number, 
    row2: number, 
    col2: number
  ) => {
    if (isProcessing) return;
    
    const newGrid = grid.map(row => [...row]);
    const temp = newGrid[row1][col1];
    newGrid[row1][col1] = { ...newGrid[row2][col2], row: row1, col: col1 };
    newGrid[row2][col2] = { ...temp, row: row2, col: col2 };
    
    setGrid(newGrid);
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Verifica se a troca criou matches
    const matches = findMatches(newGrid);
    
    if (matches.size > 0) {
      setMoves(prev => prev - 1);
      processMatches();
    } else {
      // Desfaz a troca
      setMessage("Movimento inválido!");
      const revertGrid = grid.map(row => [...row]);
      setGrid(revertGrid);
    }
  }, [grid, isProcessing, findMatches, processMatches]);

  // Handle de clique em célula
  const handleCellClick = useCallback((row: number, col: number) => {
    if (isProcessing || gameOver) return;
    
    if (!selectedCell) {
      setSelectedCell({ row, col });
      setMessage("Selecione uma forma adjacente!");
    } else {
      const rowDiff = Math.abs(selectedCell.row - row);
      const colDiff = Math.abs(selectedCell.col - col);
      
      // Verifica se é adjacente
      if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
        swapCells(selectedCell.row, selectedCell.col, row, col);
      }
      
      setSelectedCell(null);
    }
  }, [selectedCell, isProcessing, gameOver, swapCells]);

  // Verifica fim de jogo
  useEffect(() => {
    if (moves === 0 && !isProcessing) {
      if (score >= targetScore) {
        setMessage("Parabéns! Objetivo alcançado!");
        setGameOver(true);
      } else {
        setMessage("Que pena! Tente novamente!");
        setGameOver(true);
      }
    }
  }, [moves, isProcessing, score, targetScore]);

  useEffect(() => {
    initializeGrid();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  return (
    <div className={cn("flex flex-col items-center justify-center min-h-screen p-4 space-y-4", className)}>
      <VitorCharacter message={message} animate={true} />
      
      {/* Status */}
      <div className="flex gap-4 text-center">
        <div className="bg-card/80 backdrop-blur-sm rounded-xl p-3 border-2 border-accent/20">
          <p className="text-xs text-muted-foreground uppercase">Pontos</p>
          <p className="text-2xl font-bold text-foreground">{score}/{targetScore}</p>
        </div>
        <div className="bg-card/80 backdrop-blur-sm rounded-xl p-3 border-2 border-accent/20">
          <p className="text-xs text-muted-foreground uppercase">Movimentos</p>
          <p className="text-2xl font-bold text-foreground">{moves}</p>
        </div>
        <div className="bg-card/80 backdrop-blur-sm rounded-xl p-3 border-2 border-accent/20">
          <p className="text-xs text-muted-foreground uppercase">Nível</p>
          <p className="text-2xl font-bold text-foreground">{level}</p>
        </div>
      </div>

      {/* Grid */}
      <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4 border-2 border-accent/30">
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}>
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={cell.id}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                className={cn(
                  "w-12 h-12 flex items-center justify-center cursor-pointer transition-all duration-200",
                  "bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-lg border-2",
                  selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                    ? "border-accent scale-110 shadow-lg"
                    : "border-accent/20 hover:scale-105",
                  cell.isMatched && "opacity-0 scale-0",
                  cell.isFalling && "animate-fade-in"
                )}
              >
                {!cell.isMatched && (
                  <ShapeVisual
                    shapeId={cell.shape.id}
                    color={cell.shape.color}
                    size="sm"
                    className="w-8 h-8"
                  />
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Next Button */}
      {gameOver && score >= targetScore && (
        <button
          onClick={onNext}
          className="animate-bounce-in"
        >
          <img
            src={proximoDesafioBtn}
            alt="Próximo Desafio"
            className="w-48 hover:scale-105 transition-transform duration-300"
          />
        </button>
      )}

      {gameOver && score < targetScore && (
        <button
          onClick={initializeGrid}
          className="px-6 py-3 bg-accent text-white rounded-xl font-bold text-lg hover:scale-105 transition-transform"
        >
          Tentar Novamente
        </button>
      )}
    </div>
  );
};

export default MatchThreeGame;