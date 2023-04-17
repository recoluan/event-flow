export class BZM {
  __metas__ = {}
  get $metas() {
    return this.__metas__
  }

  __utils__ = {}
  get $utils() {
    return this.__utils__
  }

  __apis__ = {}
  get $apis() {
    return this.__apis__
  }

  __methods__ = {}
  get $methods() {
    return this.__methods__
  }

  __nodes__ = {}
  get $nodes() {
    return this.__nodes__
  }

  __processes__ = {}
  get $processes() {
    return this.__processes__
  }

  createNode({label, preapply, apply, postapply, HEAD}) {
    const newNode = {
      label,
      preapply: preapply && preapply.bind(this),
      apply: apply && apply.bind(this),
      postapply: postapply && postapply.bind(this),
      status: 'pending',
      HEAD,
    }

    return newNode
  }

  createProcess(nodes = {}) {
    let HEADNode = null

    Object.values(nodes).forEach(item => {
      if (item.HEAD) {
        HEADNode = item
      }
    })

    let currentNode = HEADNode

    const apply = async ({onInput, onOutput}) => {
      const output = async (action, data) => {
        await onOutput({node: currentNode.label, action, data})
      }

      const flow = v => {
        currentNode.status = v
      }
      const handleNode = async () => {
        const {label, preapply, apply, postapply, status} = currentNode
        if (preapply) {
          const input = async v => {
            if (apply) {
              await apply(v, {output, flow, ...this.$utils, ...this.$methods})
            }

            if (postapply) {
              const status = currentNode.status
              currentNode = nodes[postapply(status)]
              await handleNode()
            }
          }

          const getInput = async action => {
            await onInput({node: label, action, input})
          }

          await preapply(getInput)
        } else if (apply) {
          await apply(null, {output, flow, ...this.$utils})
        }
      }

      handleNode()
    }

    return {apply}
  }
}
