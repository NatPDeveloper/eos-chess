function parseMoveString(gameString) {
    const move = parseFloat(gameString)
    return { move }
  }
  
  function updateMoveData(state, payload, blockInfo, context) {
    const { move } = parseMoveString(payload.data.move)
    state.totalMoves += move
  }
  
  const updaters = [
    {
      actionType: "eosio::setmove",
      updater: updateMoveData,
    },
  ]
  
  module.exports = updaters