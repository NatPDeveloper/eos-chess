function logUpdate(state, payload, blockInfo, context) {
  // potential effects here, not needed currently
}

const effects = [
  {
    actionType: "chesschessch::setstat",
    effect: logUpdate,
  },
]

module.exports = effects