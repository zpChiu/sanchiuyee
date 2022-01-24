window.console = (origConsole => {
  return {
    ...origConsole,
    log() {
      origConsole && origConsole.log && origConsole.log(
        typeof arguments[0] === 'object' ? '%c SanChiuYee %c \n\n' : '%c SanChiuYee %c',
        'background:#2d8cf0; padding: 1px; border-radius: 2px; color: #fff; ', 'margin-left: -6px;',
        arguments[0]
      )
    },
    error() {
      origConsole && origConsole.log && origConsole.log(
        typeof arguments[0] === 'object' ? '%c SanChiuYee %c \n\n' : '%c SanChiuYee %c',
        'background:#F56C6C; padding: 1px; border-radius: 2px; color: #fff;', 'margin-left: -6px',
        arguments[0]
      )
    }
  }
})(window.console)
