const ENGINE_NAMES = ["slither", "mythril", "gnn", "forge"];

const getEngines = () => {
  return [...ENGINE_NAMES];
};

module.exports = {
  getEngines,
};
