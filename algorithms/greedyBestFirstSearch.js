async function greedy(beginNode, endNode, via = false, oldpath=[]){
  const frontier = [];
  const parent = new Map();
  let neighbours = [];
  let node = {
    row: beginNode.row,
    col: beginNode.col,
    heuristic: manhattan(beginNode.row, beginNode.col,endNode.row, endNode.col)
  };
  
  frontier.push(node);
  while (frontier.length > 0 && running) {
    node = frontier.shift();
    let row = node.row;
    let col = node.col;
    // if node is not start/end node, mark as visited
    if (nodes[row][col].state != STATE.START && nodes[row][col].state != STATE.FINISH && nodes[row][col].state != STATE.XSTART && nodes[row][col].state != STATE.XFINISH && nodes[row][col].state != STATE.VIA) {
      if(nodes[row][col].state == STATE.TERRAIN){
        nodes[row][col].state = STATE.VISITED_TERRAIN;
      }
      else{
        nodes[row][col].state = STATE.VISITED;
      }
    }
    // if found, draw its path and return
    if(row == endNode.row && col == endNode.col){
      if(via){
        path2 = await drawViaPath(parent, beginNode, endNode, oldpath);
        oldpath = path2;
        return oldpath;
      }
      else{
        final_lenght = await drawPath(parent, beginNode, endNode, oldpath,via); 
        return final_lenght;
      }

    } else {
      neighbours = findNeighbours(node);
      neighbours.forEach(newNode => {
        // check if node already exists in frontier
        let found = -1;
        for(let i = 0; i < frontier.length; i++) {
          if (frontier[i].row == newNode.row && frontier[i].col == newNode.col) {
            found = i;
            break;
          }
        }

        newNode.heuristic = manhattan(newNode.row, newNode.col,endNode.row, endNode.col);
        // if not in frontier / visited nodes, add it
        if(found == -1 && !parent.has(`${newNode.row},${newNode.col}`)){
          frontier.push(newNode);
          parent.set(`${newNode.row},${newNode.col}`, node);
        } else if (found >= 0) { // decrease key otherwise
          if (newNode.heuristic < frontier[found].heuristic) {
            parent.set(`${newNode.row},${newNode.col}`, node);
            frontier[found] = newNode;
          }
        }
      });
      frontier.sort((a, b) => a.heuristic - b.heuristic);
    }
    await sleep(speed);
  }

  if (running)
    return -1;
  else
    return -2;
}
