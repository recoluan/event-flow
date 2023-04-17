import {InvoiceModel} from './models/index.mjs'

const invoiceModel = new InvoiceModel()

// invoiceModel.$utils.$console('error', 'This is an error info!')

// 从模型中获取业务流程
const applyInvoice = invoiceModel.$processes.applyInvoice

// 执行业务流程
applyInvoice.apply({
  async onInput({node, action, input}) {
    invoiceModel.$utils.$console('log', `%c[触发输入] [node: ${node}] [action: ${action}]`, 'color: #43bb88;')

    if (node === '确认商家是否有发票信息') {
      invoiceModel.$utils.$console('log', `%c[input] 输入商家ID：111111`, 'color: red')
      await input(11111)
    }

    if (node === '确认账单') {
      invoiceModel.$utils.$console('log', `%c[input] 输入账单ID：33333`, 'color: red')
      await input(33333)
    }
  },
  async onOutput({node, action, data}) {
    // 根据输出修改数据
    invoiceModel.$utils.$console(
      'log',
      `%c[触发输出] [node: ${node}] [action: ${action}] [data: ${data}]`,
      'color: #43bb88;',
    )
  },
})
