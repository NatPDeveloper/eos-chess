function logUpdate(state, payload, blockInfo, context) {
  // potential effects here, not needed currently
}

const effects = [
  {
    actionType: "eosio::setstat",
    effect: logUpdate,
  },
]

module.exports = effects