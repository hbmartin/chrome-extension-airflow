function getTriggerNavButton(dagId) {
  const li = document.createElement('li');
  const a = document.createElement('a');
  a.href = `/admin/airflow/trigger?dag_id=${dagId}`;
  const span = document.createElement('span');
  span.className = 'glyphicon glyphicon-play-circle';
  const trigger = document.createTextNode('  Trigger');
  a.appendChild(span);
  a.appendChild(trigger);
  li.appendChild(a);
  return li;
}

function airflow() {
  if (document.title.indexOf('Airflow') === -1) { return; }
  if (window.location.pathname === '/admin/') {
    const alerts = document.getElementsByClassName('alert-info');
    if (alerts.length === 0) { return; }
    const alertText = alerts[0].innerText;
    const triggered = alertText.match(/Triggered (\w*),/);
    if (triggered) {
      const dag = triggered[1];
      window.location.href = `${window.location.origin}/admin/airflow/tree?dag_id=${dag}&num_runs=5`;
    }
  } else if (window.location.pathname === '/admin/airflow/log') {
    window.onscroll = (() => {
      let timeout;
      return () => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
          // eslint-disable-next-line no-restricted-globals
          timeout = setTimeout(() => { location.reload(true); }, 10000);
        } else if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
      };
    })();
    window.scrollTo(0, document.body.scrollHeight);
    window.onscroll();
  } else if (window.location.pathname === '/admin/airflow/tree') {
    if (document.getElementsByClassName('running').length !== 0) {
      // eslint-disable-next-line no-restricted-globals
      setTimeout(() => { location.reload(true); }, 10000);
    }
    const ul = document.getElementsByClassName('nav-pills')[0];
    const dagId = window.location.search.match(/dag_id=(\w*)/)[1];
    ul.appendChild(getTriggerNavButton(dagId));
  }
}

airflow();
