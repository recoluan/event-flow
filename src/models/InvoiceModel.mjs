import {BZM} from '../lib/index.mjs'

class InvoiceModel extends BZM {
  // 元数据集
  __metas__ = {
    invoiceTitle: {
      label: '发票抬头',
      prop: 'invoiceTitle',
    },
    invoiceType: {
      label: '发票类型',
      prop: 'invoiceType',
      options: [
        {label: '电子发票', value: 'electronic'},
        {label: '纸质发票', value: 'paper'},
      ],
    },
  }

  // 工具集
  __utils__ = {
    $alert(v) {
      alert(`[发票模型] ${v}`)
    },
    $console(type, ...args) {
      console[type].apply(this, args)
    },
  }

  // 服务集
  __apis__ = {
    isHaveInvoiceInfo(mis) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({
            code: 0,
            data: true,
          })
        }, 1000)
      })
    },
    confirmStatement(orderCode) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({
            code: 0,
            data: true,
          })
        }, 1000)
      })
    },
  }

  // 方法集
  __methods__ = {
    getPoiId() {},
  }

  // 业务节点集
  __nodes__ = {}

  // 业务流程集
  __processes__ = {
    applyInvoice: this.createProcess({
      // 确认商家是否有发票信息
      isHaveInvoiceInfo: this.createNode({
        HEAD: true,
        label: '确认商家是否有发票信息',
        async preapply(getInput) {
          await getInput('输入商家ID')
        },
        async apply(params, {output, flow}) {
          const {code, data} = await this.$apis.isHaveInvoiceInfo(params)
          if (code === 0 && data === true) {
            output('有发票信息', data)
            flow('fullfilled')
          } else {
            output('无发票信息', data)
            flow('rejected')
          }
        },
        postapply(status) {
          return status === 'fullfilled' ? 'confirmStatement' : ''
        },
      }),
      // 确认账单
      confirmStatement: this.createNode({
        label: '确认账单',
        async preapply(getInput) {
          await getInput('输入账单ID')
        },
        async apply(params, {output, flow}) {
          const {code, data} = await this.$apis.confirmStatement(params)
          if (code === 0 && data === true) {
            output('确认账单成功', data)
            flow('fullfilled')
          } else {
            output('确认账单失败', data)
            flow('rejected')
          }
        },
        postapply(status) {
          return status === 'fullfilled' ? 'confirmStatementSuccessTip' : 'confirmStatementFailTip'
        },
      }),
      // 确认账单成功时的提示
      confirmStatementSuccessTip: this.createNode({
        label: '确认账单成功时的提示',
        apply(_, {$alert}) {
          $alert('确认账单成功')
        },
      }),
      // 确认账单失败时的提示
      confirmStatementFailTip: this.createNode({
        label: '确认账单失败时的提示',
        apply(_, {$alert}) {
          $alert('确认账单失败')
        },
      }),
    }),
  }
}

export {InvoiceModel}
