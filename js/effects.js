function logUpdate(state, payload, blockInfo, context) {
    // console.info("State updated:\n", JSON.stringify(state, null, 2))
    console.log(payload.data)
  }
  
  const effects = [
    {
      actionType: "eosio::setmove",
      effect: logUpdate,
    },
  ]
  
  module.exports = effects