function logUpdate(state, payload, blockInfo, context) {
  // potential effects here, not needed currently
}

const effects = [
  {
    actionType: "chesseosches::setstat",
    effect: logUpdate,
  },
]

module.exports = effects