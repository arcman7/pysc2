const usedVal = { val: 0 }
const perf_hooks = {
  usedVal,
  set return_val(val) {
    usedVal.val = val
  },
  get return_val() {
    return usedVal.val
  },
  performance: {
    now() {
      return usedVal.val
    },
  },
}
module.exports = perf_hooks
