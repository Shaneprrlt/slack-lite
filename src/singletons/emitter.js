import * as ee from 'event-emitter'

export default (() => {
  let instance;
  const createEmitter = () => {
    let AbstractEmitter = () => {}
    ee(AbstractEmitter.prototype)
    return new AbstractEmitter()
  }
  return {
    getInstance() {
      if(!instance) {
        instance = createEmitter()
      }
      return instance
    }
  }
})()
