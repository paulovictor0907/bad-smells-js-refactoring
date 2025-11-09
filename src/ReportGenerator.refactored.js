export class ReportGenerator {
  constructor(database) {
    this.db = database;
  }


  generateReport(reportType, user, items) {
    const visibleItems = this._filterAndPrepareItems(items, user);

    const reportParts = [];
    let total = 0;

    reportParts.push(this._generateHeader(reportType, user));

    for (const item of visibleItems) {
      reportParts.push(this._generateRow(reportType, item, user));
      total += item.value;
    }

    reportParts.push(this._generateFooter(reportType, total));

    const separator = reportType === 'HTML' ? '' : '\n';
    return reportParts.join(separator).trim();
  }


  _filterAndPrepareItems(items, user) {
    if (user.role === 'ADMIN') {
      return items.map(item => {
        const priority = item.value > 1000;
        return { ...item, priority: priority };
      });
    }

    if (user.role === 'USER') {
      return items.filter(item => item.value <= 500);
    }

    return [];
  }


  _generateHeader(reportType, user) {
    if (reportType === 'CSV') {
      return 'ID,NOME,VALOR,USUARIO';
    }

    if (reportType === 'HTML') {
      return (
        '<html><body>\n' +
        '<h1>Relatório</h1>\n' +
        `<h2>Usuário: ${user.name}</h2>\n` +
        '<table>\n' +
        '<tr><th>ID</th><th>Nome</th><th>Valor</th></tr>'
      );
    }
    return '';
  }


  _generateRow(reportType, item, user) {
  if (reportType === 'CSV') {
      return `${item.id},${item.name},${item.value},${user.name}`;
    }

    if (reportType === 'HTML') {
      if (user && user.role === 'ADMIN') {
        if (item.priority) {
          return `<tr style="font-weight:bold;"><td>${item.id}</td><td>${item.name}</td><td>${item.value}</td></tr>`;
        }
        return `<tr ><td>${item.id}</td><td>${item.name}</td><td>${item.value}</td></tr>`;
      }

      if (item.priority) {
        return `<tr style="font-weight:bold;"><td>${item.id}</td><td>${item.name}</td><td>${item.value}</td></tr>`;
      }
      return `<tr><td>${item.id}</td><td>${item.name}</td><td>${item.value}</td></tr>`;
    }
    return '';
  }

  _generateFooter(reportType, total) {
    if (reportType === 'CSV') {
      return `\nTotal,,\n${total},,`;
    }

    if (reportType === 'HTML') {
      return (
        '</table>\n' +
        `<h3>Total: ${total}</h3>\n` +
        '</body></html>'
      );
    }
    return '';
  }
}